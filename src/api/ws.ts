/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-07 22:38:45
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-07 22:49:11
 * @Description:
 */

import { http } from "./http";

//
export const login = (user_name: string) => {
  return http("/ws/login", {
    method: "POST",
    data: {
      name: user_name,
    },
  });
};

// 获取用户的会话列表
export const getRoomList = (user_id: string) => {
  return http("/ws/room", {
    method: "GET",
    data: {
      user_id,
    },
  });
};
