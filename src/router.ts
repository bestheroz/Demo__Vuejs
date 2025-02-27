import { CanceledError } from "axios";
import type { NavigationGuardNext, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { useAdminStore } from "@/stores/admin";
import { pendingRequests } from "@/utils/apis";
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

const admin: RouteRecordRaw[] = [
  {
    path: "management",
    component: async () =>
      import("@/views/admin/management/AdminManagementPage.vue"),
  },
];

const user: RouteRecordRaw[] = [
  {
    path: "management",
    component: async () =>
      import("@/views/user/management/UserManagementPage.vue"),
  },
];

const notice: RouteRecordRaw[] = [
  {
    path: "management",
    component: async () =>
      import("@/views/notice/management/NoticeManagementPage.vue"),
  },
];

const test: RouteRecordRaw[] = [
  {
    path: "integration",
    component: async () => import("@/views/test/TestPage.vue"),
  },
];

const routes = (): RouteRecordRaw[] => {
  const error: RouteRecordRaw[] = [
    {
      path: "",
      component: async () => import("@/views/error/UnexpectedPage.vue"),
    },
    {
      path: "404",
      component: async () => import("@/views/error/NotFoundPage.vue"),
    },
  ];

  return [
    {
      path: "/admin",
      beforeEnter: requireAuth(),
      children: admin.map((v) => ({
        ...v,
        meta: {
          layout: "default",
        },
      })),
    },
    {
      path: "/user",
      beforeEnter: requireAuth(),
      children: user.map((v) => ({
        ...v,
        meta: {
          layout: "default",
        },
      })),
    },
    {
      path: "/notice",
      beforeEnter: requireAuth(),
      children: notice.map((v) => ({
        ...v,
        meta: {
          layout: "default",
        },
      })),
    },
    {
      path: "/test",
      beforeEnter: requireAuth(),
      children: test.map((v) => ({
        ...v,
        meta: {
          layout: "default",
        },
      })),
    },
    {
      path: "/",
      beforeEnter: requireAuth(),
      component: async () => import("@/views/HomePage.vue"),
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
      component: async () => import("@/views/login/LoginPage.vue"),
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

const router = createRouter({
  history: createWebHistory(),
  routes: routes(),
});

router.beforeEach((to, from, next) => {
  pendingRequests.forEach((controller) => {
    try {
      controller.abort(`Route change: ${from.path} to ${to.path}`);
    } catch (e: unknown) {
      if (e instanceof CanceledError) {
        // ignore
      } else {
        throw e;
      }
    }
  });
  pendingRequests.clear();
  next();
});

export default router;
