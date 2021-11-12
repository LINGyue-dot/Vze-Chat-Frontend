/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 19:28:20
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-11 20:54:16
 * @Description: 心跳逻辑
 */

import store from "@/store";
import { initWs } from ".";
import { MessageProp, MessageType } from "./type";
import { sendMessage } from "./utils";

// 每响应次数
let _noResponseTime: Number = 0;
let _heartTimeout: NodeJS.Timeout | undefined;

// 
const PingMsg: MessageProp = {
  type: MessageType.PING,
  message: "ping",
  from_user_id: store.state.user_id || "1",
};

// 每次发送消息时候重新开始倒计时下次发送时间
export function heartbaet() {
  if (_heartTimeout) {
    clearTimeout(_heartTimeout);
  }
  _heartTimeout = setTimeout(() => {
    // 如果上一次心跳包没有相应就摧毁这个连接，创建新的连接
    if (_noResponseTime >= 1) {
      initWs();
    }
    sendMessage(PingMsg);
  }, 5 * 1000);
}
