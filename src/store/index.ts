/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 19:46:19
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 00:51:10
 * @Description:
 */
import { createStore } from "vuex";
import ActiveStore from "./active";
import ConversationStore from "./conversation";
import InformationStore from "./information";
import permissionStore from "./permission";
import WSStoreModel from "./ws";
import HistoryStore from "@/store/history";
import MessageStore from "@/store/message";

const store = createStore<any>({
  modules: {
    permission: permissionStore,
    ws: WSStoreModel,
    active: ActiveStore,
    information: InformationStore,
    conversation: ConversationStore,
    history: HistoryStore,
    message: MessageStore,
  },
});

export default store;

export type StoreProp = typeof store;
