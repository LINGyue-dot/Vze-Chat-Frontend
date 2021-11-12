/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 19:46:19
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-12 11:45:19
 * @Description:
 */
import { login } from "@/api/ws";
import { ResponseProp, UserProp } from "@/websocket/type";
import { createStore, Module } from "vuex";
import ActiveStoreModel from "./active";
import WSStoreModel from "./ws";

export interface StateProp extends UserProp {
  login: boolean;
}

export const Types = {
  CHANGE_lOGIN: "change_login",
  CHANGE_NAME: "change_name",
  CHANGE_ID: "change_id",
  CHANGE_IMG: "change_img",
};

const store = createStore<StateProp>({
  state: {
    login: false,
    user_name: localStorage.getItem("user_name") || undefined,
    user_id: localStorage.getItem("user_id") || undefined,
    user_img: localStorage.getItem("user_img") || undefined,
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
    [Types.CHANGE_IMG](state, payload) {
      state.user_img = payload;
    },
  },
  actions: {
    // login
    login({ commit }, name: string) {
      return login(name).then((res: ResponseProp) => {
        commit(Types.CHANGE_lOGIN, true);
        commit(Types.CHANGE_NAME, name);
        commit(Types.CHANGE_ID, res.data.user_id);
        commit(Types.CHANGE_IMG, res.data.user_img);
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_id", res.data.user_id.toString());
        localStorage.setItem("user_img", res.data.user_img.toString());
        return res;
      });
    },
  },
  modules: {
    // @ts-ignore ，由于 modules 的 statetype 被继承所以解决下 fix
    ws: WSStoreModel,
    // @ts-ignore ，由于 modules 的 statetype 被继承所以解决下 fix
    active: ActiveStoreModel,
  },
});

export default store;

export type StoreProp = typeof store;
