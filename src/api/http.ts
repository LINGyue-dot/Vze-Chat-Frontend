/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 21:11:25
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-10-27 09:14:55
 * @Description: fetch get data from backend
 */

export const BASE_API = 'http://localhost:3100'

export const addWs = (name: string) => {
  return fetch(BASE_API + '/ws/add', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name
    })
  }).then(async res => {
    const data = await res.json()

    return data.user
  })
}

