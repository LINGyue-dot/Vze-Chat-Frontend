/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 20:29:10
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-12 12:20:03
 * @Description:
 */

export enum MessageType {
  // 初始化 只用户发送用
  INIT = "INIT",
  // 关闭
  CLOSE = "CLOSE",
  // 新用户加入 ws，用于通知全体使用，客户端使用该类型
  SYSTEM = "SYSTEM",
  // 携带消息的数据报
  MESSAGE = "MESSAGE",
  // 心跳包
  PING = "PING",
  PONG = "PONG",
}

// 聊天类型
//
export enum ChatType {
  PTP = "PTP", // p2p
  BLOCK = "BLOCK", // 群
}
export interface MessageProp {
  type: MessageType;
  chat_type?: ChatType;
  at_user_id?: string | undefined;
  from_user_id: string;
  to_user_id?: string;
  block_id?: string;
  message: string;
  message_id?: string;
}

export interface ResponseProp {
  code: Number;
  message: String;
  data: any;
}

export interface UserProp {
  user_id: string | undefined;
  user_name: string | undefined;
  user_img?: string | undefined;
}

export type ContacterProp = UserProp;
// 联系人消息 p2p 消息
export interface ContacterMessageProp {
  user_id: string;
  message: string;
  message_id: string | undefined;
}

export interface BlockProp {
  block_id: string;
  block_name: string;
  owner_id: string;
}

// 群消息存储
// TODO active keep-alive
export interface BlockMessageProp {
  block_id: string;
  at_user_id?: string;
  from_user_id: string;
  message_id: string;
  message: string;
}

//  websocket 回调函数
export interface WSFnsProp {
  onopen?: () => void;
  onerror?: (ev: Event) => void;
}
