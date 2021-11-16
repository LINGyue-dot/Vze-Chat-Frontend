/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 20:36:45
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 16:50:42
 * @Description: 处理信息
 */

import store from "@/store";
import { WSTypes, WSStateType } from "@/store/ws";
import { useStore } from "vuex";
import { initWs } from ".";
import { heartbaet, zeroNoResponseTime } from "./heartbeat";
import {
  BaseMessageProp,
  BlockMessageProp,
  BlockMessageStoreProp,
  ChatType,
  ContacterMessageStoreProp,
  MessageProp,
  MessageType,
  P2PMessageProp,
  SendMessageProp,
} from "./type";

// const wsStore = useStore<{ ws: WSStateType }>();
const wsStore = store;

// 处理收到的消息
export function handleMessage(ev: MessageEvent<WebSocket>) {
  const data = JSON.parse(ev.data as unknown as string) as MessageProp;
  // 只要一收到服务端的消息就将未响应的包数置零
  zeroNoResponseTime();
  switch (data.type) {
    case MessageType.PONG:
      console.log("pong");
      break;

    case MessageType.SYSTEM:
      // 新用户登录
      break;
    case MessageType.MESSAGE:
      // 消息推送
      //
      if ((data as P2PMessageProp).chat_type === ChatType.PTP) {
        hanlePTP(data as P2PMessageProp);
      }
      if ((data as BlockMessageProp).chat_type === ChatType.BLOCK) {
        hanleBlock(data as BlockMessageProp);
      }
      break;
    case MessageType.CLOSE:
      // 关闭
      break;
    default:
      break;
  }
}
// 原子操作发送消息
function sendMessage(msg: MessageProp) {
  try {
    // ws 断开
    if (wsStore.state.ws.wsInstance?.readyState === 3) {
      initWs();
      return;
    }
    wsStore.state.ws.wsInstance?.send(Buffer.from(JSON.stringify(msg)));
  } catch (e) {
    console.error(e);
  }
}
// 发送 PING 消息
export function sendPingMsg(msg: MessageProp) {
  console.log("ping");
  sendMessage(msg);
}
// 发送用户实体信息
export function sendUserMessage(msg: SendMessageProp) {
  sendMessage(msg);
}

//
function hanlePTP(message: P2PMessageProp) {
  let tempContacterMessage: ContacterMessageStoreProp = {
    user_id: message.from_user_id,
    message: message.message,
    message_id: message.message_id,
  };
  wsStore.commit(WSTypes.CHANGECONTACTERMESSAGELIST, [
    ...wsStore.state.ws.conatcterMessageList,
    tempContacterMessage,
  ]);
}

//
function hanleBlock(message: BlockMessageProp) {
  let tempBlockMessage: BlockMessageStoreProp = {
    block_id: message.block_id,
    message_id: message.message_id,
    from_user_id: message.from_user_id,
    at_user_id: message.at_user_id,
    message: message.message,
  };
  wsStore.commit(WSTypes.CHANGEBLOCKMESSAGELIST, [
    ...wsStore.state.ws.blockMessageList,
    tempBlockMessage,
  ]);
}
