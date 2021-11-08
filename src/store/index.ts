/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 19:46:19
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-07 22:41:54
 * @Description:
 */
import { login } from "@/api/ws";
import WS from "@/websocket";
import { ResponseProp, UserProp } from "@/websocket/type";
import { createStore, Module } from "vuex";

export interface StateProp extends UserProp {
  login: boolean;
  ws: WS | undefined;
}

export const Types = {
  CHANGE_lOGIN: "change_login",
  CHANGE_NAME: "change_name",
  CHANGE_ID: "change_id",
  CHANGE_WS: "change_ws",
};

const store = createStore<StateProp>({
  state: {
    login: false,
    user_name: localStorage.getItem("user_name") || undefined,
    user_id: localStorage.getItem("user_id") || undefined,
    ws: undefined,
  },
  mutations: {
    [Types.CHANGE_lOGIN](state, payload: boolean) {
      state.login = payload;
    },
    [Types.CHANGE_NAME](state, payload: string) {
      state.user_name = payload;
    },
    [Types.CHANGE_ID](state, payload: string) {
      state.user_id = payload;
    },
    [Types.CHANGE_WS](state, payload: WS | undefined) {
      state.ws = payload;
    },
  },
  actions: {
    // login
    login({ commit }, name: string) {
      return login(name).then((res: ResponseProp) => {
        commit(Types.CHANGE_lOGIN, true);
        commit(Types.CHANGE_NAME, name);
        console.log(res);
        commit(Types.CHANGE_ID, res.data.user_id);

        localStorage.setItem("user_name", name);
        localStorage.setItem("user_id", res.data.user_id.toString());
        return res;
      });
    },
  },
  modules: {},
});

export default store;

export type StoreProp = typeof store;
