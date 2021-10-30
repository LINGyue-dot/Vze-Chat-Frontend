/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 20:29:10
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-10-30 17:03:30
 * @Description:
 */

export enum MessageType {
  // 初始化
  INIT = 'INIT',
  // 关闭
  CLOSE = 'CLOSE',
  // 新用户加入或者其他通知
  SYSTEM = 'SYSTEM',
  // 其他用户的消息
  USER = 'USER',
  // 心跳包
  PING = 'PING',
  PONG = 'PONG'
}

export interface UserProp {
  id: string;
  username: string;
}

export interface MessageProp extends UserProp {
  type: MessageType,
  message?: string | null;
}

export interface WsOptions {
  connectSuccess?: (() => void);
  connectFail?: ((str: string) => void);
  onmessage: undefined | ((data: MessageProp) => void);
  onopen: undefined | (() => void);
  onerror?: undefined | ((e: Error) => void);
}

