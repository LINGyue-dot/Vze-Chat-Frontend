/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-07 22:38:45
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 08:58:06
 * @Description:
 */

import { http } from "./http";
import store from "../store";

//
export const login = (user_name: string) => {
  return http("/ws/login", {
    method: "POST",
    data: {
      name: user_name,
    },
  });
};
// 获取用户详细信息
export const getUserInformation = (user_id: string) => {
  return http("/ws/user", {
    method: "GET",
    data: {
      user_id,
    },
  });
};
// 获取群详细信息
export const getBlockInformation = (block_id: string) => {
  return http("/ws/block", {
    method: "GET",
    data: {
      block_id,
    },
  });
};

// 获取用户的会话列表
export const getConversationList = () => {
  return http("/ws/conversation", {
    method: "GET",
    data: {
      user_id: store.state.permission.user_id,
    },
  });
};
