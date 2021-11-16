/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 19:28:20
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 16:45:15
 * @Description: 心跳逻辑
 */

import store from "@/store";
import { PermissionStateType } from "@/store/permission";
import { useStore } from "vuex";
import { initWs } from ".";
import { MessageProp, MessageType, OtherMessageProp } from "./type";
import { sendPingMsg } from "./utils";

// const permissionStore = useStore<{ permission: PermissionStateType }>();
const permissionStore = store;

// 每响应次数
let _noResponseTime: number = 0;
let _heartTimeout: NodeJS.Timeout | undefined;

//
const PingMsg: OtherMessageProp = {
  type: MessageType.PING,
  message: "ping",
  from_user_id: store.state.permission.user_id || "1",
};

// 每次发送消息时候重新开始倒计时下次发送时间
export function heartbaet() {
  if (_heartTimeout) {
    clearInterval(_heartTimeout);
    _noResponseTime++;
  }
  _heartTimeout = setInterval(() => {
    // 如果上一次心跳包没有相应就摧毁这个连接，创建新的连接
    if (_noResponseTime >= 3) {
      initWs();
    }
    sendPingMsg(PingMsg);
    // 每发送一个 PING 包或者数据包时候就将其 ++
    _noResponseTime++;
  }, 5 * 1000);
}

export function zeroNoResponseTime() {
  _noResponseTime = 0;
}
