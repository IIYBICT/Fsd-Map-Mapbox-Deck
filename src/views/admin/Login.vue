<template>
  <div class="flex justify-center items-center h-screen">
    <n-card embedded :bordered="false" style="max-width: 600px">
      <div class="flex justify-center text-lg font-bold">
        登录后台 - {{ configStore.$state.configData.WebName }}
      </div>
      <n-form ref="formRef" :model="modelRef" :rules="rules">
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="modelRef.password"
            type="password"
            @keydown.enter.prevent
          />
        </n-form-item>
        <n-row :gutter="[0, 24]">
          <n-col :span="24">
            <div style="display: flex; justify-content: flex-end">
              <n-button
                :loading="loginRoading"
                round
                secondary
                strong
                @click="handleValidateButtonClick"
                class="w-full"
              >
                登录
              </n-button>
            </div>
          </n-col>
        </n-row>
      </n-form>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { loginAdminApi } from "@/api/admin";
import router from "@/router";
import { useConfigStore } from "@/store/modules/config";
import { setToken } from "@/utils/auth";
import { FormInst, FormItemRule, FormRules, useMessage } from "naive-ui";
import { ref } from "vue";

const configStore = useConfigStore();
interface ModelType {
  password: string | null;
}
const rules: FormRules = {
  password: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入密码");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
};
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const modelRef = ref<ModelType>({
  password: null,
});
const loginRoading = ref(false);
const handleValidateButtonClick = (e: MouseEvent) => {
  loginRoading.value = true;
  e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      const resData = await loginAdminApi(modelRef.value.password);
      if (resData.data.Data) {
        setToken(String(modelRef.value.password));
        message.success("登录成功！");
        window.location.href = "/admin";
      } else {
        message.error(resData.data.Msg);
      }
      loginRoading.value = false;
    } else {
      message.error("请输入密码！");
      loginRoading.value = false;
    }
  });
};
</script>
