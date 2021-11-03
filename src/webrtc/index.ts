/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-03 17:42:03
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-03 20:44:43
 * @Description:
 */

import io from "socket.io-client";
import initEvent from "./event";
export * from "./polyfill";

// @ts-ignore
const socket = io("http://localhost:3100");

initEvent(socket);

export default socket;
