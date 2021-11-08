/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 20:29:04
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-07 20:27:30
 * @Description:
 */

export const WS_API = "ws://localhost:7000";

import { MessageProp, MessageType, WsOptions } from "./type";
import store from "@/store";

class WS {
  private _websocket: WebSocket | undefined;

  private _incomingOnmessage: undefined | ((data: MessageProp) => void);
  private _incomingOnopen: undefined | (() => void);
  private _incomingOnerror: undefined | ((e: Error) => void);

  private _connectSuccess: undefined | (() => void);
  private _connectFail: undefined | ((str: string) => void);

  // heartbeat
  private _noResponseTime: Number = 0;

  private _heartTimeout: NodeJS.Timeout | undefined;
  // 存储配置信息，为了断线重连摧毁原链接建立新的 ws 使用
  private _wsUrl: string | undefined;
  private _wsConfigFn: WsOptions | undefined;

  constructor(url: string, configFn: WsOptions) {
    this._wsUrl = url;
    this._wsConfigFn = configFn;
    this._init();
  }

  private _init() {
    if (!this._wsUrl || !this._wsConfigFn) {
      return;
    }
    this.closeWs();
    this._noResponseTime = 0;

    // init websocket
    this._websocket = new WebSocket(this._wsUrl);
    // attention 'this' pointer
    this._websocket.onopen = this._onopen.bind(this);
    this._websocket.onmessage = this._onmessage.bind(this);
    //
    this._connectSuccess = this._wsConfigFn.connectSuccess;
    this._connectFail = this._wsConfigFn.connectFail;
    //
    this._incomingOnopen = this._wsConfigFn.onopen;
    this._incomingOnmessage = this._wsConfigFn.onmessage;
    this._incomingOnerror = this._wsConfigFn.onerror;
  }

  private _onopen() {
    this._incomingOnopen && this._incomingOnopen();
    this._sendInitData();
  }

  private _onmessage(evt: MessageEvent<WebSocket>) {
    const data = JSON.parse(evt.data as unknown as string) as MessageProp;

    // 清空掉心跳包记录，有返回数据说明该连接还可以用
    this._noResponseTime = 0;
    if (data.type !== MessageType.PONG) {
      // show all message from server about oneself or others
      this._incomingOnmessage && this._incomingOnmessage(data);
    } else {
      // to debug
      console.log("pong");
    }
  }

  // 发送心跳包逻辑
  private _handleSendPing() {
    console.log("ping");
    // 发送的时候开始下次心跳包发送的倒计时
    if (this._heartTimeout) {
      clearTimeout(this._heartTimeout);
    }
    this._heartTimeout = setTimeout(() => {
      //
      // 如果上一次的心跳包没有响应，则摧毁此链接，创建新的连接
      if (this._noResponseTime >= 1) {
        this._init();
      }
      this.send("ping", MessageType.PING);
    }, 5 * 1000);
  }

  private _sendInitData() {
    this.send("join", MessageType.INIT);
  }

  // send message to server
  private _send(data: MessageProp) {
    try {
      // websocket 断开
      if (this._websocket?.readyState === 3) {
        this._init();
        return;
      }

      this._websocket?.send(Buffer.from(JSON.stringify(data)));
    } catch (e) {
      console.log("108");
      console.error(e);
    }
  }

  public closeWs() {
    this._websocket?.close();
  }

  // universal send fucntion for outer
  public send(msg: string, type?: MessageType) {
    this._handleSendPing();

    const tempData: MessageProp = {
      user_name: store.state.user_name || "",
      user_id: store.state.user_id || "",
      type: type || MessageType.USER,
      message: msg,
    };
    this._send(tempData);
  }
}

export default WS;
