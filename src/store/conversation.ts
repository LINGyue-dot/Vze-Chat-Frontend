/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-14 21:13:37
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 08:20:51
 * @Description: 会话列表的 store
 * 会给每个会话分配一个 id 方便 v-for
 * id 分配规则：如果是联系人会话就 c_[user_id] 加上前缀 c_ 群聊就 b_
 */

import { getConversationList } from "@/api/ws";
import { turnToConversation } from "@/utils/handler";
import { ConversationProp, ResponseProp } from "@/websocket/type";
import { Action, Module, Mutation } from "vuex";

// 该 store 的 state 类型
export interface ConversationStateType {
  conversationList: ConversationProp[];
}

export interface ConversationStoreType
  extends Module<ConversationStateType, ConversationStateType> {
  state: ConversationStateType;
  mutations: {
    initConversationList: Mutation<ConversationStateType>;
    pushConversationList: Mutation<ConversationStateType>;
  };
  actions: {
    getConversation: Action<ConversationStateType, ConversationStateType>;
    topConversation: Action<ConversationStateType, ConversationStateType>;
  };
}

// commit type
export const ConversationType = {
  initConversationList: "conversation/initConversationList",
  pushConversationList: "conversation/pushConversationList",
};

const initState: ConversationStateType = {
  conversationList: [],
};

const ConversationStore: ConversationStoreType = {
  namespaced: true,
  state: initState,
  mutations: {
    initConversationList(state, payload) {
      state.conversationList = [];
      state.conversationList = payload;
    },
    pushConversationList(state, payload) {
      if (Array.isArray(payload)) {
        state.conversationList = [...state.conversationList, ...payload];
      } else {
        state.conversationList = [...state.conversationList, payload];
      }
    },
  },
  actions: {
    async getConversation({ commit }) {
      const res: ResponseProp<any> = await getConversationList();
      let result: ConversationProp[] = [];
      res.data.forEach((item: any) => {
        result.push(turnToConversation(item));
      });
      commit("initConversationList", result);
    },
    // 将某个 conversation 提升至最高，如果没有该 conversation 则新建，payload 是 UserProp?BlockProp?&{conversation_id}，并将其返回
    async topConversation({ state, commit }, payload) {
      const { user, block, conversation_id } = payload;
      const list = state.conversationList;
      for (let i = 0; i < list.length; i++) {
        // 如果存在
        if (list[i].conversation_id === conversation_id) {
          let temp = list[i];
          list.splice(i, 1);
          list.unshift(temp);
          return temp;
        }
      }
      //  如果不存在该会话，则构造会话
      let temp = turnToConversation(user || block);
      console.log(temp);
      list.unshift(temp);
      return temp;
    },
  },
};

export default ConversationStore;
