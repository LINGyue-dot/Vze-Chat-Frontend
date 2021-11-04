/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-03 17:42:03
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-04 18:51:38
 * @Description:
 */

import io, { Socket } from "socket.io-client";
import initEvent from "./event";
export * from "./polyfill";


export default function initSocket(): Promise<Socket> {
	const socket = io("http://localhost:3100");
	initEvent(socket);
	return new Promise(resolve => {
		resolve(socket);
	});
}
