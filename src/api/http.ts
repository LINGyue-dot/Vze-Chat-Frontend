/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 21:11:25
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-15 00:57:13
 * @Description: fetch get data from backend
 */
import qs from "qs";

export const BASE_API = "http://localhost:3100";

export interface ConfigProp extends RequestInit {
  data?: Object;
}

export const http = async (
  endpoint: String,
  { data, headers, ...customConfig }: ConfigProp = {},
  baseUrl: string = BASE_API
) => {
  // token
  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }
  return fetch(`${baseUrl}${endpoint}`, config).then((response: any) =>
    response.json()
  );
};
