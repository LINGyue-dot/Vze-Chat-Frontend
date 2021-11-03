/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-03 18:49:20
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-03 18:54:20
 * @Description: 设置兼容的 api
 */

// if (navigator.mediaDevices === undefined) {
//   navigator.mediaDevices = {};
// }

// 如果没有 navigator.mediaDevices.getUserMedia 就用 navigator.getUserMedia
if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia = function (params) {
    let getUserMedia =
      // @ts-ignore
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, params, resolve, reject);
    });
  };
}

export const PeerConnection =
  window.RTCPeerConnection ||
  // @ts-ignore
  window.mozRTCPeerConnection ||
  // @ts-ignore
  window.webkitRTCPeerConnection;
