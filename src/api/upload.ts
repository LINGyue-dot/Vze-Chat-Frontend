/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-26 10:12:17
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2022-03-03 19:24:24
 * @Description: 
 */
import axios, { AxiosRequestHeaders } from "axios";
import { UPLOAD_API } from "@/api/config";
import { http } from "@/api/http";

export function uploadHelper({
  suffix,
  formData,
}: {
  suffix: string;
  formData: FormData;
}) {
  return axios.request({
    method: "POST",
    url: `${UPLOAD_API}/${suffix}`,
    data: formData,
    onUploadProgress: (p) => {
      console.log(p);
    },
  });
}

export function vertifyFile(filename: string, fileHash: string) {
  return http(
    "/verify",
    {
      method: "POST",
      data: {
        filename,
        fileHash,
      },
    },
    UPLOAD_API
  );
}
