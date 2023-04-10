<template>
  <div>
    <n-config-provider
      :locale="zhCN"
      :theme="darkTheme"
      :theme-overrides="themeOverrides"
    >
      <n-message-provider>
        <router-view v-if="configStore.$state.isInit" />
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { GlobalThemeOverrides, zhCN, darkTheme } from "naive-ui";
import { useConfigStore } from "./store/modules/config";
const configStore = useConfigStore();
configStore.getConfig();
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: configStore.$state.configData.ThemeColor,
  },
  DataTable: {
    borderColor: "#ffffff00",
    tdColor: "#ffffff00",
    thColor: "#ffffff00",
    tdTextColor: "#ffffff",
    thColorHover: "#ffffff00",
    tdColorHover: "#ffffff00",
    thTextColor: "#ffffff",
  },
  Descriptions: {
    thTextColor: "#ffffff",
    tdTextColor: "#ffffff",
  },
};
</script>
<style>
.mapboxgl-Popup-content {
  color: #f3f3dd;
  background-color: #91785d;
  border-color: #91785d;
  max-width: 250px;
  box-shadow: 3px 3px 2px #8b5d33;
  font-family: "Oswald";
}
</style>
