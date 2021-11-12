/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-12 11:24:58
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-12 11:29:05
 * @Description:
 */

// 类型判断
export function TypeOf(obj: any) {
  return typeof obj !== "object"
    ? typeof obj
    // @ts-ignore
    : Object.prototype.toString().call(obj).slice(8, -1).toLowerCase();
}
