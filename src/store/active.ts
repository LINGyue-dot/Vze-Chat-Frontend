/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-12 10:57:02
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-12 12:10:28
 * @Description: 当前 active 的部分状态属性
 */

import { BlockMessageProp, BlockProp, ContacterMessageProp, ContacterProp } from "@/websocket/type";
import { Module, Mutation } from "vuex";

// 最左侧菜单栏选择
export enum TabProp {
  Conversation = "Conversation",
  Contacter = "Contacter",
}

// 中间会话栏列表 item
// v-for 中的 id 用 'b'+block_id or 'c'+contacter_id
export type ConversationProp = (BlockProp | ContacterProp) & {
  is_block: boolean;
  notice_num: number;
  // TODO 最后消息以及时间
  last_time?: string;
  last_message?: string;
};

// 当前 active 的会话选择
export type ActiveConversation = ConversationProp | undefined;

//
export interface ActiveStateProp {
  tab: TabProp;
  conversationList: ConversationProp[];
  activeconversation: ActiveConversation;
}

export interface ActiveStoreType
  extends Module<ActiveStateProp, ActiveStateProp> {
  namespaced: boolean;
  name: string;
  state: ActiveStateProp;
  mutations: {
    switchTab: Mutation<ActiveStateProp>;
    addConversationList: Mutation<ActiveStateProp>;
    changeActiveConversation: Mutation<ActiveStateProp>;
  };
}
export const ActiveTypes = {
  SWITCHTAB: "active/switchTab",
  ADDCONVERSATIONLIST: "active/addConversationList",
  CHANGEACTIVECONVERSATION: "active/changeActiveConversation",
};

const initState: ActiveStateProp = {
  tab: TabProp.Conversation,
  conversationList: [],
  activeconversation: undefined,
};

const ActiveStoreModel: ActiveStoreType = {
  namespaced: true,
  name: "active",
  state: initState,
  mutations: {
    switchTab(state, payload: TabProp) {
      state.tab = payload;
      console.log('68 active', payload)
    },
    addConversationList(state, payload: ConversationProp | ConversationProp[]) {
      if (Array.isArray(payload)) {
        state.conversationList = [...state.conversationList, ...payload];
      } else {
        state.conversationList = [...state.conversationList, payload];
      }
    },
    changeActiveConversation(state, payload) {
      state.activeconversation = payload;
    },
  },
};

export default ActiveStoreModel;
