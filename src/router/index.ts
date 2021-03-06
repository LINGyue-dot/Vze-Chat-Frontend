/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 19:46:19
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-14 22:35:01
 * @Description:
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import store from "@/store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/chat",
    component: () => import("@/layout/base-layout.vue"),
    children: [
      {
        path: "/login",
        component: () => import("@/views/login/index.vue"),
      },
      {
        path: "/home",
        component: () => import("@/views/home/index.vue"),
      },
      {
        path: "/chat",
        component: () => import("@/views/chat/index.vue"),
      },
      {
        path: "/meeting",
        component: () => import("@/views/meeting/index.vue"),
      },
      {
        path: "/offer",
        component: () => import("@/views/meeting/offer.vue"),
      },
      {
        path: "/answer",
        component: () => import("@/views/meeting/answer.vue"),
      },
      {
        path: "/upload",
        component: () => import("@/views/upload/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path != "/login" && !store.state.permission.login_state) {
    next("/login");
  } else {
    next();
  }
});

export default router;
