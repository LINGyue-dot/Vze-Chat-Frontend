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
