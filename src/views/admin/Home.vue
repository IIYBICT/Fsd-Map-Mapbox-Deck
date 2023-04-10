<template>
  <n-layout>
    <n-layout-header class="h-12 px-2" bordered>
      <div class="w-full h-full">
        <div class="float-left h-full flex items-center font-bold">
          连飞地图后台
        </div>
        <div class="float-right h-full flex items-center" @click="Logout">
          登出
        </div>
      </div>
    </n-layout-header>
    <n-layout-content
      class="md:px-60 pt-5"
      content-style="padding: 24px;min-height: 90vh"
    >
      <n-upload
        multiple
        directory-dnd
        class="my-2"
        method="post"
        :on-finish="
          () => {
            message.success('上传成功！');
            configStore.getConfig();
          }
        "
        :headers="{
          token: String(getToken()),
        }"
        action="/admin/update/logo"
        :max="5"
        :show-file-list="false"
      >
        <n-upload-dragger>
          <n-image
            width="150"
            height="150"
            preview-disabled
            :src="'/assets/logo.png'"
          />
          <div>图片格式：30x30</div>
        </n-upload-dragger>
      </n-upload>
      <n-form ref="formRef" :model="modelRef">
        <n-form-item path="password" label="管理员密码">
          <n-input
            v-model:value="password"
            placeholder="新的密码"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button
                round
                secondary
                strong
                type="primary"
                @click="updatePassword"
                class="w-full mt-5"
              >
                修改密码
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
      <n-form ref="formRef" :model="modelRef">
        <n-form-item path="WebName" label="网站名称">
          <n-input
            maxlength="15"
            v-model:value="modelRef.WebName"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item path="MapboxToken" label="MapBox地图Token">
          <n-input
            v-model:value="modelRef.MapboxToken"
            @keydown.enter.prevent
          />
        </n-form-item>
        <span class="text-gray-400"
          >注：该样式现有到MapBox上申请Token，没有的保持默认</span
        >
        <n-form-item path="MapboxStyle" label="MapBox地图样式">
          <n-input
            v-model:value="modelRef.MapboxStyle"
            @keydown.enter.prevent
          />
        </n-form-item>
        <span class="text-gray-400"
          >注：该样式现有到MapBox上设计，没有的保持默认</span
        >
        <n-form-item label="获取航迹时长（秒)" path="GetTrackTime">
          <n-input-number
            :min="0"
            style="width: 100%"
            maxlength="3"
            v-model:value="modelRef.GetTrackTime"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item label="删除航迹时长(分钟)" path="DelTrackTime">
          <n-input-number
            :min="0"
            style="width: 100%"
            maxlength="30"
            v-model:value="modelRef.DelTrackTime"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-form-item label="主题颜色" path="ThemeColor">
          <n-color-picker
            v-model:value="modelRef.ThemeColor"
            :modes="['hex']"
          />
        </n-form-item>
        <span class="text-gray-400"
          >注：主题颜色修改后需要手动刷新页面才能生效</span
        >
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button
                round
                secondary
                strong
                type="primary"
                @click="updateConfig"
                class="w-full mt-5"
              >
                修改配置
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </n-layout-content>
    <n-layout-footer class="h-12 py-2">
      <div class="flex justify-center h-12 items-center text-gray-400">
        @DeStudio
      </div>
    </n-layout-footer>
  </n-layout>
</template>
<script setup lang="ts">
import {
  getAdminConfigApi,
  loginAdminApi,
  updateConfigApi,
  updatePasswordApi,
} from "@/api/admin";
import router from "@/router";
import { ConfigData, useConfigStore } from "@/store/modules/config";
import { clearToken, getToken, isLogin } from "@/utils/auth";
import { useMessage } from "naive-ui";
import { ref } from "vue";
const configStore = useConfigStore();
const message = useMessage();
const isLoginJk = async () => {
  const resData = await loginAdminApi(getToken());
  if (resData.data.Data) {
    message.success("欢迎管理员");
  } else {
    window.location.href = "/admin/login";
  }
};
if (!isLogin()) {
  window.location.href = "/admin/login";
} else {
  isLoginJk();
}
const Logout = () => {
  clearToken();
  window.location.href = "/admin";
};

const password = ref<string>("");
const modelRef = ref<ConfigData>({
  WebName: configStore.$state.configData.WebName,
  WhUpdateTime: configStore.$state.configData.WhUpdateTime,
  MapboxStyle: configStore.$state.configData.MapboxStyle,
  MapboxToken: configStore.$state.configData.MapboxToken,
  ThemeColor: configStore.$state.configData.ThemeColor,
  GetTrackTime: configStore.$state.configData.GetTrackTime,
  DelTrackTime: configStore.$state.configData.DelTrackTime,
});
getAdminConfigApi().then((resData) => {
  if (resData.data.Code !== 200) {
    message.error(resData.data.Msg);
    window.location.href = "/admin/login";
  }
});
const updateConfig = async () => {
  const resData = await updateConfigApi(modelRef.value);
  if (resData.data.Code == 200) {
    message.success("更新成功！");
    configStore.getConfig();
  } else {
    message.error(resData.data.Msg);
  }
};

const updatePassword = async () => {
  const resData = await updatePasswordApi(String(getToken()), password.value);
  if (resData.data.Code == 200) {
    message.success("更新成功！");
    configStore.getConfig();
  } else {
    message.error(resData.data.Msg);
  }
};
</script>
