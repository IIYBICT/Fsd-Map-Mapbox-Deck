import { AppConfig } from "@/configs/AppConfig";
import { ConfigData } from "@/store/modules/config";
import http from "@/utils/http";

export const getConfigApi = () => {
  return http.get<{
    Code: number;
    Msg: string;
    Data: ConfigData;
  }>(AppConfig.api + "/config");
};
