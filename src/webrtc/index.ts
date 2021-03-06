/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-03 17:42:03
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-04 20:00:54
 * @Description:
 */

import io, { Socket } from "socket.io-client";
import initEvent from "./event";
export * from "./polyfill";
import "webrtc-adapter";
import { SOCKETIO_API } from "@/api/config";

export default function initSocket(): Promise<Socket> {
  const socket = io(SOCKETIO_API);
  initEvent(socket);
  return new Promise((resolve) => {
    resolve(socket);
  });
}
