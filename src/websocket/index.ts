/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 20:29:04
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 15:59:15
 * @Description:
 * 需要页面传递函数的：1.onopen 2.断开连接 function
 */

import { WSTypes, WSStateType } from "@/store/ws";
import { handleMessage, sendInitMessage } from "./utils";
import store from "@/store";
import { heartbaet } from "./heartbeat";
import { WS_API } from "@/api/config";

// const wsStore = useStore<{ ws: WSStateType }>();
const wsStore = store;

// 初始化 ws
export const initWs = () => {
  if (!wsStore.state.ws.onopen || !wsStore.state.ws.onerror) {
    return;
  }
  // 摧毁旧的 ws
  if (wsStore.state.ws.wsInstance) {
    wsStore.state.ws.wsInstance.close();
  }
  let tempWS = new WebSocket(WS_API);
  wsStore.commit(WSTypes.CHANGEWSINSTANCE, tempWS);

  heartbaet();

  // 加上 if 只是为了去除 ts 报错
  if (wsStore.state.ws.wsInstance) {
    // 外部函数
    wsStore.state.ws.wsInstance.onopen = () => {
      wsStore.state.ws.onopen!();
      sendInitMessage();
    };
    wsStore.state.ws.wsInstance.onerror = (ev: Event) => {
      wsStore.state.ws.onerror!(ev);
    };
    //
    wsStore.state.ws.wsInstance.onmessage = (ev: MessageEvent<WebSocket>) => {
      handleMessage(ev);
    };
  }
};
