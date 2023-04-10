import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { createDiscreteApi, useMessage } from "naive-ui";
import { getToken } from "./auth";

const http = axios.create({
  timeout: 10000,
});
http.interceptors.request.use(
  (config) => {
    config.headers.token = getToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const res = response;
    return res;
  },
  (error) => {
    // console.log(error);
    const { message } = createDiscreteApi(["message"]);
    // const q = error.message;
    // const appId = "20210530000848259";
    // const salt = getSalt(9);
    // const key = "tknVA2QpW2udc4aAHkYs";
    // const sign = md5(appId + q + salt + key);
    // http.get("/fanyi?from=en&to=zh&appid=" + appId + "&salt=" + salt + "&sign=" + sign + "&q=" + q).then((res: any) => {
    //   message.error(res.trans_result[0].dst);
    // });
    message.error(error.message);
    return Promise.reject(error);
  }
);
export default http;
