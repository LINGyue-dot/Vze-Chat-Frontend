/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-14 21:12:05
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 10:26:17
 * @Description: 部分资料的 store
 * 存 用户信息列表、群信息
 */

import { getBlockInformation, getUserInformation } from "@/api/ws";
import { BlockProp, ResponseProp, UserProp } from "@/websocket/type";
import { Action, Module, Mutation } from "vuex";

// 信息
export interface InformationStateType {
  userList: UserProp[]; // 用户列表
  blockList: BlockProp[]; // 群列表
}

export interface InformationStoreType
  extends Module<InformationStateType, InformationStateType> {
  state: InformationStateType;
  mutations: {
    pushUserList: Mutation<InformationStateType>;
    pushtBlockList: Mutation<InformationStateType>;
  };
  actions: {
    getUserInformation: Action<InformationStateType, InformationStateType>;
    getBlockInformation: Action<InformationStateType, InformationStateType>;
  };
}

// TODO 考虑用 Set 结构
const initState: InformationStateType = {
  userList: [],
  blockList: [],
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
  },
  actions: {
    getUserInformation({ state, commit }, user_id: string) {
      return new Promise((resolve, reject) => {
        let user: UserProp | undefined;
        state.userList.forEach((item) => {
          if (item.user_id == user_id) {
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
          if (item.block_id == block_id) {
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
  },
};

export default InformationStore;
