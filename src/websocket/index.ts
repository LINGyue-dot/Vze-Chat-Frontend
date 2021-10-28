/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 20:29:04
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-10-28 23:58:46
 * @Description:
 */

export const WS_API = 'ws://localhost:7000'


import { MessageProp, MessageType, WsOptions } from "./type"
import store from '@/store'

class WS {

  private _websocket: WebSocket | undefined;

  private _incomingOnmessage: undefined | ((data: MessageProp) => void);
  private _incomingOnopen: undefined | (() => void);
  private _incomingOnerror: undefined | ((e: Error) => void);

  private _connectSuccess: undefined | (() => void);
  private _connectFail: undefined | ((str: string) => void)


  constructor(url: string, configFn: WsOptions,) {
    // init websocket
    this._websocket = new WebSocket(url)
    // attention 'this' pointer 
    this._websocket.onopen = this._onopen.bind(this)
    this._websocket.onmessage = this._onmessage.bind(this)
    //
    this._connectSuccess = configFn.connectSuccess
    this._connectFail = configFn.connectFail
    //
    this._incomingOnopen = configFn.onopen
    this._incomingOnmessage = configFn.onmessage
    this._incomingOnerror = configFn.onerror
    //
  }


  private _onopen() {
    this._incomingOnopen && this._incomingOnopen()
    this._sendInitData()
  }

  private _onmessage(evt: MessageEvent<WebSocket>) {
    const data = JSON.parse(evt.data as unknown as string) as MessageProp;

    // this._hanleInit(data)

    // show all message from server about oneself or others
    this._incomingOnmessage && this._incomingOnmessage(data)
  }


  private _sendInitData() {
    this.send('join', MessageType.INIT)
  }

  // send message to server 
  private _send(data: MessageProp) {
    this._websocket?.send(Buffer.from(JSON.stringify(data)))
  }


  private _onclose() {

  }

  // universal send fucntion for outer
  public send(msg: string, type?: MessageType) {
    const tempData: MessageProp = {
      username: store.state.username || '',
      id: store.state.id || '',
      type: type || MessageType.USER,
      message: msg
    }
    this._send(tempData)
  }
}


export default WS