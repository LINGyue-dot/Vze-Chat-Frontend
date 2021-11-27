/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-15 00:21:05
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 00:34:00
 * @Description:
 */

// 将 message 类型转换为 conversation 类型
import { ConversationProp } from "@/websocket/type";
import { imgUrl } from "@/utils/config";

export function turnToConversation(data: any) {
  let cov: ConversationProp = {
    is_block: !!data.block_id,
    block_id: data.block_id?.toString(),
    contacter_id: data.contacter_id?.toString() || data.user_id?.toString(),
    conversation_id: data.block_id
      ? `b_${data.block_id}`
      : data.contacter_id
      ? `c_${data.contacter_id}`
      : "",
  };
  return cov;
}

// 提取文件后缀名
const extractExt = (filename: string) =>
  filename.slice(filename.lastIndexOf("."), filename.length); // 提取后缀名

export function generateImageUrl(filename: string, fileHash: string) {
  return `${imgUrl}/${fileHash}${extractExt(filename)}`;
}
