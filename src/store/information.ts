/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-14 21:12:05
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 10:26:17
 * @Description: 部分资料的 store
 * 存 用户信息列表、群信息
 */

import {
  getBlockInformation,
  getBlockList,
  getContacterList,
  getUserInformation,
} from "@/api/ws";
import { BlockProp, ResponseProp, UserProp } from "@/websocket/type";
import { Action, Module, Mutation } from "vuex";
import { stat } from "fs";

// 信息
export interface InformationStateType {
  userList: UserProp[]; // 用户列表
  blockList: BlockProp[]; // 群列表
  contacterList: UserProp[]; // 联系人列表
}

export interface InformationStoreType
  extends Module<InformationStateType, InformationStateType> {
  state: InformationStateType;
  mutations: {
    pushUserList: Mutation<InformationStateType>;
    pushtBlockList: Mutation<InformationStateType>;
    initContacterList: Mutation<InformationStateType>;
    initBlockList: Mutation<InformationStateType>;
  };
  actions: {
    getUserInformation: Action<InformationStateType, InformationStateType>;
    getBlockInformation: Action<InformationStateType, InformationStateType>;
    getContacterList: Action<InformationStateType, InformationStateType>;
    getBlockList: Action<InformationStateType, InformationStateType>;
  };
}

// TODO 考虑用 Set 结构
const initState: InformationStateType = {
  userList: [],
  blockList: [],
  contacterList: [],
};
const InformationStore: InformationStoreType = {
  namespaced: true,
  state: initState,
  mutations: {
    pushUserList(state, payload) {
      state.userList = [...state.userList, payload];
    },
    pushtBlockList(state, payload) {
      state.blockList = [...state.blockList, payload];
    },
    initContacterList(state, payload) {
      state.contacterList = payload;
    },
    initBlockList(state, payload) {
      state.blockList = payload;
    },
  },
  actions: {
    getUserInformation({ state, commit }, user_id: string) {
      return new Promise((resolve, reject) => {
        let user: UserProp | undefined;
        state.userList.forEach((item) => {
          if (item.user_id == user_id && item.user_img && item.user_name) {
            user = item;
          }
        });
        if (user) {
          // 如果以及有存储
          resolve({
            ...user,
            user_id: user.user_id?.toString(),
          });
        } else {
          // 如果没有存储则请求
          getUserInformation(user_id).then((res: ResponseProp<any>) => {
            commit("pushUserList", res.data[0]);
            resolve({
              ...res.data[0],
              user_id: res.data[0]?.user_id.toString(),
            });
          });
        }
      });
    },
    getBlockInformation({ state, commit }, block_id: string) {
      return new Promise((resolve, reject) => {
        let block: BlockProp | undefined;
        state.blockList.forEach((item) => {
          if (item.block_id == block_id && item.block_img && item.block_name) {
            block = item;
          }
        });
        if (block) {
          resolve({
            ...block,
            block_id: block.block_id.toString(),
          });
        } else {
          getBlockInformation(block_id).then((res: ResponseProp<any>) => {
            commit("pushtBlockList", res.data[0]);
            resolve({
              ...res.data[0],
              block_id: res.data[0]?.block_id.toString(),
            });
          });
        }
      });
    },
    async getContacterList({ commit }) {
      try {
        const { data } = await getContacterList();
        commit("initContacterList", data);
        data.forEach((user: UserProp) => commit("pushUserList", user));
      } catch (e) {
        console.error(e);
      }
    },
    // 获取用户的群列表
    async getBlockList({ commit }) {
      try {
        const { data } = await getBlockList();
        commit("initBlockList", data);
      } catch (e) {
        console.error(e);
      }
    },
  },
};

export default InformationStore;
