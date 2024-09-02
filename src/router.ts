import type { NavigationGuardNext, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { useAdminStore } from "@/stores/admin";
import { goLoginPage } from "@/utils/commands";

const requireAuth =
  () => async (_to: unknown, _from: unknown, next: NavigationGuardNext) => {
    const { loggedIn } = useAdminStore();
    if (!loggedIn) {
      next(false);
      return await goLoginPage();
    }
    return next();
  };

const routes = (): RouteRecordRaw[] => {
  const error: RouteRecordRaw[] = [
    {
      path: "",
      component: () => import("@/views/error/UnexpectedPage.vue"),
    },
    {
      path: "404",
      component: () => import("@/views/error/NotFoundPage.vue"),
    },
  ];

  return [
    {
      path: "/",
      beforeEnter: requireAuth(),
      component: () => import("@/views/HomePage.vue"),
      meta: {
        layout: "default",
      },
    },
    {
      path: "/error",
      children: error.map((v) => ({
        ...v,
        meta: {
          layout: "error",
        },
      })),
    },
    {
      path: "/login",
      component: () => import("@/views/login/LoginPage.vue"),
      meta: {
        layout: "auth",
      },
    },
    {
      path: "/:catchAll(.*)", // Unrecognized path automatically matches 404,
      redirect: "/error/404",
    },
  ];
};

export default createRouter({
  history: createWebHistory(),
  routes: routes(),
});
