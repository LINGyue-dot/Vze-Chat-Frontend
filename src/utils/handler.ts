/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-15 00:21:05
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 00:34:00
 * @Description:
 */

import { ConversationProp } from "@/store/conversation";


// 将 message 类型转换为 conversation 类型
export function turnToConversation(data: any) {
  let cov: ConversationProp = {
    is_block: data.block_id ? true : false,
    block_id: data.block_id,
    contacter_id: data.contacter_id,
    notice_num: 0,
    conversation_id: data.block_id ?
      `b_${data.block_id}`
      : data.contacter_id ?
        `c_${data.contacter_id}` : ''
  }
  return cov
}