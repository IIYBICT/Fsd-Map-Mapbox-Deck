import { AppConfig } from "@/configs/AppConfig";
import { ConfigData } from "@/store/modules/config";
import http from "@/utils/http";
import qs from "query-string";

export const loginAdminApi = (password: string | null) => {
  // return http.get("/api/login", {
  return http.get(AppConfig.api + "/login", {
    params: {
      password: password,
    },
  });
};
export const updateConfigApi = (data: ConfigData) => {
  return http.post(AppConfig.api + "/config", qs.stringify(data));
};

export const updatePasswordApi = (oldPassword: string, newPassword: string) => {
  return http.post(
    AppConfig.api + "/update/password",
    qs.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword,
    })
  );
};
export const getAdminConfigApi = () => {
  return http.get<{
    Code: number;
    Msg: string;
    Data: ConfigData;
  }>(AppConfig.api + "/admin/config");
};
