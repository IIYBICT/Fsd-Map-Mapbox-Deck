import { createApp } from "vue";
import "@/styles/tailwind.css";
import router from "@/router";
import "@/router/permission";
import store from "@/store";
import App from "./App.vue";

createApp(App).use(store).use(router).mount("#app");
