/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 20:36:45
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 15:46:57
 * @Description: 处理信息
 */

import { WSTypes, WSStateType } from "@/store/ws";
import { useStore } from "vuex";
import { initWs } from ".";
import { heartbaet } from "./heartbeat";
import {
  BlockMessageProp,
  BlockMessageStoreProp,
  ChatType,
  ContacterMessageStoreProp,
  MessageProp,
  MessageType,
  P2PMessageProp,
} from "./type";

const wsStore = useStore<{ ws: WSStateType }>();

// 处理收到的消息
export function handleMessage(ev: MessageEvent<WebSocket>) {
  // 每次收到服务器发来的消息就重新开始心跳计时
  heartbaet();

  const data = JSON.parse(ev.data as unknown as string) as MessageProp;

  switch (data.type) {
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

export function sendMessage(msg: MessageProp) {
  try {
    // ws 断开
    if (wsStore.state.ws.wsInstance?.readyState === 3) {
      initWs();
      return;
    }
    // TODO send fail
    wsStore.state.ws.wsInstance?.send(Buffer.from(JSON.stringify(msg)));
  } catch (e) {
    console.error(e);
  }
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
