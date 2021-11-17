/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-14 21:13:37
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 08:20:51
 * @Description: 保证可靠传输的 store
 * 1. temp_id 与确认标志位的 map
 * 2. temp_id 与计时器 的 map
 * 3. temp_id 与消息内容的 map
 */

import {
  ConfirmMessageProp,
  SendMessageProp,
  TempMessageState,
} from "@/websocket/type";
import { TimerType } from "@/utils/type";
import { Action, Module, Mutation } from "vuex";

export interface MessageStateProp {
  flagMap: Map<string, TempMessageState>; // 消息与确认标志位 map ，收到消息就删除
  timerMap: Map<string, TimerType>; // 倒计时 map ，收到消息或者计时器结束就删除
  tempMap: Map<string, SendMessageProp>; // 消息副本，收到消息就删除
}

export interface MessageStoreProp
  extends Module<MessageStateProp, MessageStateProp> {
  namespaced: boolean;
  state: MessageStateProp;
  mutations: {
    addFlagMap: Mutation<MessageStateProp>;
    addTimerMap: Mutation<MessageStateProp>;
    addTempMap: Mutation<MessageStateProp>;
  };
  actions: {
    //发送消息
    send: Action<MessageStateProp, MessageStateProp>;
    // 重传消息
    reSend: Action<MessageStateProp, MessageStateProp>;
    // 确认消息
    confirm: Action<MessageStateProp, MessageStateProp>;
  };
}

const initState: MessageStateProp = {
  flagMap: new Map(),
  timerMap: new Map(),
  tempMap: new Map(),
};

const MessageStore: MessageStoreProp = {
  namespaced: true,
  state: initState,
  mutations: {
    addFlagMap(state, payload) {
      state.flagMap.set(payload.temp_id, TempMessageState.SENDING);
    },
    addTempMap(state, payload) {
      state.tempMap.set(payload.temp_id, payload);
    },
    addTimerMap(state, payload) {
      state.timerMap.set(
        payload.temp_id,
        setTimeout(() => {
          // 超时就说明发送失败
          // 修改 temp 消息的标志位为失败
          // 去除 计时器 map 中内容
          state.flagMap.set(payload.temp_id, TempMessageState.FAIL);
          state.timerMap.delete(payload.temp_id);
        }, 1 * 1000)
      );
    },
  },
  actions: {
    // 发送消息确认机制
    send({ commit }, payload: SendMessageProp) {
      // 发送消息需要添加数据到三个 map 中
      commit("addFlagMap", payload);
      commit("addTempMap", payload);
      commit("addTimerMap", payload);
    },
    // 重新发送消息，传递 temp_id 过来
    // 修改状态为 sending 发送中
    // 重新开始计时
    reSend({ state, commit }, payload: string) {
      console.log("resend");
      state.flagMap.set(payload, TempMessageState.SENDING);
      commit("addTimerMap", {
        temp_id: payload,
      });
    },
    // 确认消息
    // 去除三个 map 中的数据以及清除倒计时, 传递 temp_id
    confirm({ state }, payload: ConfirmMessageProp) {
      console.log("confirm");
      console.log(payload);
      state.flagMap.set(payload.temp_id, TempMessageState.CONFIRM);
      state.flagMap.delete(payload.temp_id);
      if (state.timerMap.get(payload.temp_id) !== undefined) {
        // @ts-ignore
        clearTimeout(state.timerMap.get(payload.temp_id));
      }
      state.timerMap.delete(payload.temp_id);

      // 为什么不直接删除 temp_id 与 tempmessage 的备份，而要给他赋值上真实的 message_id 呢？
      // 原因是 tempMessage 在 history 中也是相同备份，需要给 history 中的该条消息赋值上真正的 message_id 而不是 -2，为了消息排序
      const tempMessage = state.tempMap.get(payload.temp_id);
      if (tempMessage) {
        tempMessage.message_id = payload.message_id;
      }

      state.tempMap.delete(payload.temp_id);
    },
  },
};

export default MessageStore;
