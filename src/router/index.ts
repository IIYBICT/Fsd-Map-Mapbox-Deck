import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const constantRouterMap: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/admin/login",
    name: "adminLogin",
    component: () => import("@/views/admin/Login.vue"),
  },
  {
    path: "/admin",
    name: "admin",
    component: () => import("@/views/admin/Home.vue"),
  },
];
const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
