import router from "@/router";
import { useConfigStore } from "@/store/modules/config";
import { createDiscreteApi } from "naive-ui";
router.beforeEach((to, _, next) => {
  const configStore = useConfigStore();
  configStore.getConfig();
  next();
});
