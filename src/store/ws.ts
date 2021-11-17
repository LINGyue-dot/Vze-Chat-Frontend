import { WSFnsProp } from "@/websocket/type";
import { Module, Mutation } from "vuex";

/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-11 19:37:27
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 17:08:46
 * @Description:
 */

// TODO 添加个 active 状态
export interface WSStateType extends WSFnsProp {
  wsInstance: WebSocket | undefined;
}

export interface WSStoreType extends Module<WSStateType, WSStateType> {
  namespaced: boolean;
  name: string;
  state: WSStateType;
  mutations: {
    changeWSInstance: Mutation<WSStateType>;
    initWSFns: Mutation<WSStateType>;
  };
}

export const WSTypes = {
  CHANGEWSINSTANCE: "ws/changeWSInstance",
  INITWSFNS: "ws/initWSFns",
};
const initState: WSStateType = {
  wsInstance: undefined,
  onopen: () => {
    console.log("websocket open");
  },
  onerror: (e: Event) => {
    console.log("websocket error");
  },
};

const WSStoreModel: WSStoreType = {
  namespaced: true,
  name: "ws",
  state: initState,
  mutations: {
    changeWSInstance(state, payload: WebSocket) {
      state.wsInstance = payload;
    },
    initWSFns(state, payload: WSFnsProp) {
      state.onopen = payload.onopen;
      state.onerror = payload.onerror;
    },
  },
};

export default WSStoreModel;
