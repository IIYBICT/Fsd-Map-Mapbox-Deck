<template>
  <DeMap />
</template>
<script setup lang="ts">
import { useConfigStore } from "@/store/modules/config";
import DeMap from "./DeMap.vue";
const configStore = useConfigStore();
configStore.getConfig();
document.title = configStore.$state.configData.WebName;
</script>
