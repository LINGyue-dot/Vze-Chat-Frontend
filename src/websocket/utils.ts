/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 20:36:45
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 16:50:42
 * @Description: 处理收到信息
 */

import store from "@/store";
import { initWs } from ".";
import { zeroNoResponseTime } from "./heartbeat";
import {
  BlockMessageProp,
  ChatType,
  MessageProp,
  MessageType,
  P2PMessageProp,
  ReceiveMessageProp,
  SendMessageProp,
} from "./type";

// const wsStore = useStore<{ ws: WSStateType }>();
const wsStore = store;

// 处理收到的消息
export function handleMessage(ev: MessageEvent<WebSocket>) {
  const data = JSON.parse(ev.data as unknown as string) as ReceiveMessageProp;
  // 只要一收到服务端的消息就将未响应的包数置零
  zeroNoResponseTime();
  switch (data.type) {
    case MessageType.PONG:
      break;

    case MessageType.SYSTEM:
      // 新用户登录
      break;
    case MessageType.MESSAGE:
      console.log(data);
      // 返回确认消息
      backConfirmMessage(data);
      // 消息推送
      //
      if ((data as P2PMessageProp).chat_type === ChatType.PTP) {
        hanlePTP(data as P2PMessageProp);
      }
      if ((data as BlockMessageProp).chat_type === ChatType.BLOCK) {
        hanleBlock(data as BlockMessageProp);
      }
      break;
    case MessageType.CONFIRM:
      store.dispatch("message/confirm", data);
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

export function sendInitMessage() {
  sendMessage({
    type: MessageType.INIT,
    from_user_id: wsStore.state.permission.user_id,
    message: "init",
  });
}

export function backConfirmMessage(message: ReceiveMessageProp) {
  sendMessage({
    ...message,
    type: MessageType.CONFIRM,
  });
}

// 发送 PING 消息
export function sendPingMsg(msg: MessageProp) {
  console.log("ping");
  sendMessage(msg);
}

// 发送用户实体信息
// 0. 为其分配一个 temp_id
// 1. 将其直接 push 到对应群/联系人的历史消息中
// 2. 添加消息到三个 map 中
export function sendP2P(msg: P2PMessageProp) {
  let temp: SendMessageProp = {
    ...msg,
    from_user_id: msg.from_user_id.toString(),
    temp_id: Date.now().toString(),
    to_user_id: msg.to_user_id.toString(),
  };
  store.dispatch("history/addP2PHistory", temp);
  store.dispatch("message/send", temp);
  sendMessage(temp);
}

export function sendBlock(msg: BlockMessageProp) {
  let temp: SendMessageProp = {
    ...msg,
    temp_id: Date.now().toString(),
  };
  store.dispatch("history/addBlockHistory", temp);
  store.dispatch("message/send", temp);
  sendMessage(temp);
}

// 接收 p2p 消息
function hanlePTP(message: P2PMessageProp) {
  wsStore.dispatch("history/addP2PHistory", {
    ...message,
    to_user_id: message.to_user_id.toString(),
    from_user_id: message.from_user_id.toString(),
  });
}

//
function hanleBlock(message: BlockMessageProp) {
  console.log("hanleBlock");
  wsStore.dispatch("history/addBlockHistory", {
    ...message,
    from_user_id: message.from_user_id.toString(),
    at_user_id: message.at_user_id?.toString(),
    block_id: message.block_id.toString(),
  });
}
