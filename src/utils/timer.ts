/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-12 11:24:58
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 00:20:59
 * @Description: 时间戳转换工具类
 */

/**
 * 判断2个时间戳是否接近，即是否大于2分钟
 * @param timestamp1
 * @param timestamp2
 */
export function isCloser(timestamp1: number, timestamp2: number) {
  var timediff = (timestamp2 - timestamp1) / 1000; //这里拿到的是毫秒,除以1000 得到秒单位
  //分钟
  const minutes = Number((timediff / 60) % 60);
  return minutes < 2;
}

// 将时间戳转换为具体时间
export function dateFormat(time: number) {
  const t = new Date(time);
  // 日期格式
  const format = "Y-m-d h:i:s";
  let year = t.getFullYear();
  // 由于 getMonth 返回值会比正常月份小 1
  let month = t.getMonth() + 1;
  let day = t.getDate();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();
  month = month > 9 ? month : Number(`0${month}`);
  day = day > 9 ? day : Number(`0${day}`);
  hours = hours > 9 ? hours : Number(`0${hours}`);
  minutes = minutes > 9 ? minutes : Number(`0${minutes}`);
  seconds = seconds > 9 ? seconds : Number(`0${seconds}`);

  const hash = {
    Y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  return format.replace(/\w/g, (o) => {
    // @ts-ignore
    return hash[o];
  });
}
