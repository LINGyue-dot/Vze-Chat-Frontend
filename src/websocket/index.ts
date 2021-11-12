/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 20:29:04
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-11 21:22:37
 * @Description:
 * 需要页面传递函数的：1.onopen 2.断开连接 function
 */

import { Types, WSStateType } from "@/store/ws";
import { useStore } from "vuex";
import { handleMessage } from "./utils";

export const WS_API = "ws://localhost:7000";

const store = useStore<WSStateType>();

// 初始化 ws
export const initWs = () => {
  if (!store.state.onopen || !store.state.onerror) {
    return;
  }
  // 摧毁旧的 ws
  if (store.state.wsInstance) {
    store.state.wsInstance.close();
  }
  let tempWS = new WebSocket(WS_API);
  store.commit(Types.CHANGEWSINSTANCE, tempWS);

  // 加上 if 只是为了去除 ts 报错
  if (store.state.wsInstance) {
    // 外部函数
    store.state.wsInstance.onopen = () => {
      store.state.onopen!();
    };
    store.state.wsInstance.onerror = (ev: Event) => {
      store.state.onerror!(ev);
    };
    //
    store.state.wsInstance.onmessage = (ev: MessageEvent<WebSocket>) => {
      handleMessage(ev);
    };
  }
};
