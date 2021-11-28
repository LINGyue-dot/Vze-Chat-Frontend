/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 19:37:27
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 17:08:46
 * @Description: 历史记录存储
 */

import {
  BlockMessageProp,
  P2PMessageProp,
  SendBlockMessageProp,
  SendP2PMessageProp,
} from "@/websocket/type";
import { Action, Module } from "vuex";

export interface HistoryStateType {
  // p2p 消息 map ， key 是 user_id or block_id
  p2pHistory: Map<string, P2PMessageProp[] | SendP2PMessageProp[]>;
  blockHistory: Map<string, BlockMessageProp[] | SendBlockMessageProp[]>; //
  // p2p 通知数目 key 是联系人 id
  p2pNotice: Map<string, number>;
  // block 通知数目
  blockNotice: Map<string, number>;
}

export interface HistoryStoreType
  extends Module<HistoryStateType, HistoryStateType> {
  namespaced: boolean;
  state: HistoryStateType;
  mutations: {};
  actions: {
    initP2PHistory: Action<HistoryStateType, HistoryStateType>;
    initBlockHistory: Action<HistoryStateType, HistoryStateType>;

    // 添加
    addP2PHistory: Action<HistoryStateType, HistoryStateType>;
    addBlockHistory: Action<HistoryStateType, HistoryStateType>;
  };
}

const initState: HistoryStateType = {
  p2pHistory: new Map(),
  blockHistory: new Map(),
  p2pNotice: new Map(),
  blockNotice: new Map(),
};

const HistoryStore: HistoryStoreType = {
  namespaced: true,
  state: initState,
  mutations: {},
  actions: {
    initP2PHistory({ state }, payload) {},
    initBlockHistory({ state }) {},
    addP2PHistory(
      { state, rootState },
      payload: P2PMessageProp | SendP2PMessageProp
    ) {
      // 如果是用户自己发送的消息，直接 push
      // @ts-ignore
      if (payload.from_user_id == rootState.permission.user_id) {
        // 如果没有该记录，创建一个 key-value
        if (!state.p2pHistory.has(payload.to_user_id)) {
          state.p2pHistory.set(payload.to_user_id, []);
        }
        //
        const tempArr = state.p2pHistory.get(payload.to_user_id);
        tempArr?.push(payload as SendP2PMessageProp);
      } else {
        // 别人发送的消息
        if (!state.p2pHistory.get(payload.from_user_id)) {
          // 如果没有历史消息映射 直接创建
          state.p2pHistory.set(payload.from_user_id, []);
        }
        // 需要选择插入的位置
        const temp = state.p2pHistory.get(payload.from_user_id);
        insertHistory<P2PMessageProp>(temp as [], payload as P2PMessageProp);
        //  调整未读消息数目
        //  通知数目调整
        // 如果是 active 则不操作
        if (
          // @ts-ignore
          !rootState.active.activeChat ||
          // @ts-ignore
          (rootState.active.activeChat &&
            // @ts-ignore
            rootState.active.activeChat?.user_id != payload.from_user_id)
        ) {
          console.log(payload.from_user_id, typeof payload.from_user_id);
          // 如果不是 active 的就未读数目数目++
          state.p2pNotice.set(
            payload.from_user_id,
            (state.p2pNotice.get(payload.from_user_id) || 0) + 1
          );
        }
      }
    },
    addBlockHistory(
      { state, rootState },
      payload: BlockMessageProp | SendBlockMessageProp
    ) {
      payload.block_id = payload.block_id.toString();
      // 如果没有记录则创建
      if (!state.blockHistory.has(payload.block_id)) {
        state.blockHistory.set(payload.block_id, []);
      }

      // 如果是自己消息，直接 push 进入消息列表
      // @ts-ignore
      if (payload.from_user_id == rootState.permission.user_id) {
        const tempArr = state.blockHistory.get(payload.block_id);
        console.log("push new block message", payload);
        tempArr?.push(payload as SendBlockMessageProp);
      } else {
        // 如果别人消息
        const tempArr = state.blockHistory.get(payload.block_id);
        insertHistory<BlockMessageProp>(tempArr as BlockMessageProp[], payload);

        // 调整未读消息数目
        //  如果当前 active 为空，或者当前 active 不为收到的群聊 则未读数目++
        if (
          // @ts-ignore
          !rootState.active.activeChat ||
          // @ts-ignore
          (rootState.active.activeChat &&
            // @ts-ignore
            rootState.active.activeChat?.block_id != payload.block_id)
        ) {
          // 如果不是 active 的就未读数目数目++
          state.blockNotice.set(
            payload.block_id,
            (state.blockNotice.get(payload.block_id) || 0) + 1
          );
        }
      }
    },
  },
};

// 将接收来的 P2P 数据/群数据插入到合适的历史记录中
export function insertHistory<T>(arr: T[], message: T) {
  let i = arr.length - 1;
  // 如果为空直接插入
  if (i < 0) {
    arr.push(message);
    return;
  }
  for (; i >= 0; i--) {
    // @ts-ignore
    if (arr[i].message_id == -2) {
      // 如果 message_id 为 -2 表示未分配
      continue;
    }
    // @ts-ignore
    if (arr[i].message_id < message.message_id) {
      break;
    }
  }
  // 插入到 i 之后
  arr.splice(i + 1, 0, message);
}

export default HistoryStore;
