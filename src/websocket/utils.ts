/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 20:36:45
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-12 00:16:43
 * @Description: 处理信息
 */

import { Types, WSStateType } from "@/store/ws";
import { useStore } from "vuex";
import { initWs } from ".";
import { heartbaet } from "./heartbeat";
import {
  BlockMessageProp,
  ChatType,
  ContacterMessageProp,
  MessageProp,
  MessageType,
} from "./type";

const store = useStore<WSStateType>();

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
      if (data.chat_type === ChatType.PTP) {
        hanlePTP(data);
      }
      if (data.chat_type === ChatType.BLOCK) {
        hanleBlock(data);
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
    if (store.state.wsInstance?.readyState === 3) {
      initWs();
      return;
    }
    // TODO send fail
    store.state.wsInstance?.send(Buffer.from(JSON.stringify(msg)));
  } catch (e) {
    console.error(e);
  }
}

//
function hanlePTP(message: MessageProp) {
  let tempContacterMessage: ContacterMessageProp = {
    user_id: message.from_user_id,
    message: message.message,
    message_id: message.message_id,
  };
  store.commit(Types.CHANGECONTACTERMESSAGELIST, [
    ...store.state.conatcterMessageList,
    tempContacterMessage,
  ]);
}

//
function hanleBlock(message: MessageProp) {
  let tempBlockMessage: BlockMessageProp = {
    block_id: message.block_id || "1",
    message_id: message.message_id || "1",
    from_user_id: message.from_user_id,
    at_user_id: message.at_user_id,
    message: message.message,
  };
  store.commit(Types.CHANGEBLOCKMESSAGELIST, [
    ...store.state.blockMessageList,
    tempBlockMessage,
  ]);
}
