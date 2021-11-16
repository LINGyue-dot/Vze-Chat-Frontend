/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 20:29:10
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 17:11:34
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
  // 确认消息
  CONFIRM = "CONFIRM",
}

// 聊天类型
//
export enum ChatType {
  PTP = "PTP", // p2p
  BLOCK = "BLOCK", // 群
}

export interface BaseMessageProp {
  type: MessageType; // 区分类型字段
  from_user_id: string; // 0 是系统 id
  message: string;
  message_id: string; // 心跳不存在 id ，系统通知是 -1 、其余是 0 、未分配是 -2
}

export interface P2PMessageProp extends BaseMessageProp {
  chat_type: ChatType; // 区分类型字段
  to_user_id: string;
}
export interface BlockMessageProp extends BaseMessageProp {
  chat_type: ChatType; // 区分类型字段
  block_id: string;
  at_user_id: string | undefined;
}
// 系统
export interface SystemMessageProp extends BaseMessageProp { }

// 心跳、初始化
export type OtherMessageProp = Omit<BaseMessageProp, "message_id"> & {
  message?: string | undefined;
};

// 客户端发送给服务端的消息类型
// 需要自己生成一个临时 id 真实 id 在服务端给出
export type SendMessageProp = (P2PMessageProp | BlockMessageProp) & {
  temp_id: string; // 时间戳
};
// 服务器回传的确认消息
export type ConfirmMessageProp = SendMessageProp;

// 接收的消息类型
export type ReceiveMessageProp =
  | P2PMessageProp
  | BlockMessageProp
  | SystemMessageProp
  | OtherMessageProp
  | ConfirmMessageProp;

// 所有类型消息
export type MessageProp = ReceiveMessageProp | SendMessageProp;

export type TempMessageProp = SendMessageProp & {
  expire: bigint; // 过期时间，时间戳
};

export interface ResponseProp<T> {
  code: Number;
  message: String;
  data: T;
}

export interface UserProp {
  user_id: string | null;
  user_name: string | undefined;
  user_img?: string | null;
}

export type ContacterProp = UserProp;
// 联系人消息 p2p 消息 存储在 vuex
export interface ContacterMessageStoreProp {
  user_id: string;
  message: string;
  message_id: string | undefined;
}

export interface BlockProp {
  block_id: string;
  block_name: string;
  block_img?: string;
  owner_id: string;
}

// 群消息存储在 vuex
// TODO active keep-alive
export interface BlockMessageStoreProp {
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
