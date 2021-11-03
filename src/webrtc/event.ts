/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-03 17:45:45
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-03 18:41:07
 * @Description:
 */

import { Socket } from "socket.io-client";

function initEvent(socket: Socket) {
  socket.on("connection", () => { });
}

export default initEvent;
