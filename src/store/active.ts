/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-12 10:57:02
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 16:52:28
 * @Description: 当前 active 的部分状态属性
 * 存 active tab , active conversation_id ,active block_id || contacter_id
 */

import { BlockProp, ContacterProp } from "@/websocket/type";
import { Action, Module, Mutation } from "vuex";

// 最左侧菜单栏选择
export enum TabProp {
  Conversation = "Conversation",
  Contacter = "Contacter",
}

//
export interface ActiveStateProp {
  activeTab: TabProp;
  activeConversationId: string | undefined;
  activeChat: BlockProp | ContacterProp | undefined;
}

export interface ActiveStoreType
  extends Module<ActiveStateProp, ActiveStateProp> {
  namespaced: boolean;
  name: string;
  state: ActiveStateProp;
  mutations: {
    switchTab: Mutation<ActiveStateProp>;
    changeActiveConversation: Mutation<ActiveStateProp>;
  };
}
export const ActiveTypes = {
  SWITCHTAB: "active/switchTab",
  CHANGEACTIVECONVERSATION: "active/changeActiveConversation",
};

const initState: ActiveStateProp = {
  activeTab: TabProp.Conversation,
  activeConversationId: undefined,
  activeChat: undefined,
};

const ActiveStore: ActiveStoreType = {
  namespaced: true,
  name: "active",
  state: initState,
  mutations: {
    switchTab(state, payload: TabProp) {
      state.activeTab = payload;
    },
    changeActiveConversation(
      state,
      payload: {
        activeConversationId: string;
        activeChat: BlockProp | ContacterProp | undefined;
      }
    ) {
      state.activeConversationId = payload.activeConversationId;
      state.activeChat = payload.activeChat;
    },
  },
};

export default ActiveStore;
