/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-04 18:00:18
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-04 18:01:34
 * @Description:
 */

export enum SocketUserProp {
  OFFER = "offer",
  ANSWER = "answer",
}

export interface SocketMessageProp {
  identity: SocketUserProp;
  message: any;
}
