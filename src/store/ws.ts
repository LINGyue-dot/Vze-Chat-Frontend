import {
  BlockMessageProp,
  BlockProp,
  ContacterMessageProp,
  ContacterProp,
  UserProp,
  WSFnsProp,
} from "@/websocket/type";
import { Module, Mutation } from "vuex";

/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 19:37:27
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-12 11:12:46
 * @Description:
 */
// TODO 添加个 active 状态
export interface WSStateType extends WSFnsProp {
  wsInstance: WebSocket | undefined;
  conatcterList: ContacterProp[]; // 联系人列表
  conatcterMessageList: ContacterMessageProp[]; // 来自联系人的消息
  blockList: BlockProp[]; // 群列表
  blockMessageList: BlockMessageProp[]; // 来自群的消息
}

export interface WSStoreType extends Module<WSStateType, WSStateType> {
  namespaced: boolean;
  name: string;

  state: WSStateType;
  mutations: {
    changeWSInstance: Mutation<WSStateType>;
    changeContacterList: Mutation<WSStateType>;
    changeContacterMessageList: Mutation<WSStateType>;
    changeBlockList: Mutation<WSStateType>;
    changeBlockMessageList: Mutation<WSStateType>;
    initWSFns: Mutation<WSStateType>;
  };
}

export const WSTypes = {
  CHANGEWSINSTANCE: "ws/changeWSInstance",
  CHANGEBLOCKLIST: "ws/changeBlockList",
  CHANGEBLOCKMESSAGELIST: "ws/changeBlockMessageList",
  CHANGECONTACTERLIST: "ws/changeContacterList",
  CHANGECONTACTERMESSAGELIST: "ws/changeContacterMessageList",
  INITWSFNS: "ws/initWSFns",
};
const initState: WSStateType = {
  wsInstance: undefined,
  conatcterList: [],
  conatcterMessageList: [],
  blockList: [],
  blockMessageList: [],
};

const WSStoreModel: WSStoreType = {
  namespaced: true,
  name: "ws",
  state: initState,
  mutations: {
    changeWSInstance(state, payload: WebSocket) {
      state.wsInstance = payload;
    },
    changeBlockList(state, payload: BlockProp[]) {
      state.blockList = payload;
    },
    changeBlockMessageList(state, payload: BlockMessageProp[]) {
      state.blockMessageList = payload;
    },
    changeContacterList(state, payload: ContacterProp[]) {
      state.conatcterList = payload;
    },
    changeContacterMessageList(state, payload: ContacterMessageProp[]) {
      state.conatcterMessageList = payload;
    },
    initWSFns(state, payload: WSFnsProp) {
      state.onopen = payload.onopen;
      state.onerror = payload.onerror;
    },
  },
};

export default WSStoreModel;
