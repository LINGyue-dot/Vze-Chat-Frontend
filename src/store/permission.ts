/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-14 21:27:43
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 10:49:25
 * @Description: 用户权限相关
 */

import { login } from "@/api/ws";
import { ResponseProp, UserProp } from "@/websocket/type";
import { Action, Module, Mutation } from "vuex";

export interface PermissionStateType extends UserProp {
  login_state: boolean; // 登录状态，用于路由跳转
}

export interface PermissionStoreType
  extends Module<PermissionStateType, PermissionStateType> {
  name: string;
  state: PermissionStateType;
  mutations: {
    changeLogin: Mutation<PermissionStateType>;
    changeUserName: Mutation<PermissionStateType>;
    changeUserId: Mutation<PermissionStateType>;
    changeUserImg: Mutation<PermissionStateType>;
  };
  actions: {
    login: Action<PermissionStateType, PermissionStateType>;
  };
}

const initState: PermissionStateType = {
  login_state: false,
  user_name: localStorage.getItem("user_name") || undefined,
  user_id: localStorage.getItem("user_id"),
  user_img: localStorage.getItem("user_img"),
};

const permissionStore: PermissionStoreType = {
  namespaced: true,
  name: "permission",
  state: initState,
  mutations: {
    changeLogin(state, payload) {
      state.login_state = payload;
    },
    changeUserId(state, payload) {
      state.user_id = payload;
      localStorage.setItem("user_id", payload);
    },
    changeUserName(state, payload) {
      state.user_name = payload;
      localStorage.setItem("user_name", payload);
    },
    changeUserImg(state, payload) {
      state.user_img = payload;
      localStorage.setItem("user_img", payload);
    },
  },
  actions: {
    login({ commit }, name: string) {
      return login(name).then((res: ResponseProp<any>) => {
        commit("changeLogin", true);
        commit("changeUserName", name);
        commit("changeUserId", res.data.user_id);
        commit("changeUserImg", res.data.user_img);
        return res;
      });
    },
  },
};

export const PermissionTypes = {
  CHANGE_lOGIN: "permission/change_login",
  CHANGE_NAME: "permission/change_name",
  CHANGE_ID: "permission/change_id",
  CHANGE_IMG: "permission/change_img",
};

export default permissionStore;
