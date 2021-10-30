/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 19:46:19
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-10-30 16:49:13
 * @Description: 
 */
import { addWs } from '@/api/http'
import WS from '@/websocket'
import { UserProp } from '@/websocket/type'
import { createStore, Module } from 'vuex'

export interface StateProp {
  login: boolean,
  username: string | undefined,
  id: string | undefined,
  ws: WS | undefined
}


export const Types = {
  CHANGE_lOGIN: 'change_login',
  CHANGE_NAME: 'change_name',
  CHANGE_ID: 'change_id',
  CHANGE_WS: 'change_ws'
}

const store = createStore<StateProp>({
  state: {
    login: false,
    username: localStorage.getItem('username') || undefined,
    id: localStorage.getItem('id') || undefined,
    ws: undefined
  },
  mutations: {
    [Types.CHANGE_lOGIN](state, payload: boolean) {
      state.login = payload
    },
    [Types.CHANGE_NAME](state, payload: string) {
      state.username = payload
    },
    [Types.CHANGE_ID](state, payload: string) {
      state.id = payload
    },
    [Types.CHANGE_WS](state, payload: WS | undefined) {
      state.ws = payload
    }

  },
  actions: {
    // login
    login({ commit }, name: string) {
      return addWs(name).then((res: UserProp) => {
        commit(Types.CHANGE_lOGIN, true)
        commit(Types.CHANGE_NAME, name)
        commit(Types.CHANGE_ID, res.id)

        localStorage.setItem('username', name)
        localStorage.setItem('id', res.id.toString())
        return res
      })
    },

  },
  modules: {}
})

export default store

export type StoreProp = typeof store