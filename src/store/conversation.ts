/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-14 21:13:37
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 08:20:51
 * @Description: 会话列表的 store
 * 会给每个会话分配一个 id 方便 v-for
 * id 分配规则：如果是联系人会话就 c_[message_id] 加上前缀 c_ 群聊就 b_
 */

import { getConversationList } from "@/api/ws";
import { turnToConversation } from "@/utils/handler";
import { MessageProp, ResponseProp } from "@/websocket/type";
import { Action, Module, Mutation } from "vuex";

// 会话 item 类型
export interface ConversationProp {
  is_block: boolean;
  conversation_id: string;
  // 添加冗余数据为了减少数据切片
  contacter_id?: string;
  block_id?: string;
  notice_num: number; // 未读消息数量
  // TODO 应该得存储在 redis 的会话的数据中
  last_user_name?: string; // 最后发消息的用户名称
  last_time?: string; // 最后消息时间
  last_message?: string; // 最后消息内容
}
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
      console.log(result);
    },
  },
};

export default ConversationStore;
