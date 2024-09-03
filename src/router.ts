import type { NavigationGuardNext, RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";
import { useAdminStore } from "@/stores/admin";
import { goLoginPage } from "@/utils/commands";
import { pendingRequests } from "@/utils/apis";
import { CanceledError } from "axios";

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
    component: () => import("@/views/admin/management/AdminManagementPage.vue"),
  },
];

const user: RouteRecordRaw[] = [
  {
    path: "management",
    component: () => import("@/views/user/management/UserManagementPage.vue"),
  },
];

const notice: RouteRecordRaw[] = [
  {
    path: "management",
    component: () =>
      import("@/views/notice/management/NoticeManagementPage.vue"),
  },
];

const test: RouteRecordRaw[] = [
  {
    path: "integration",
    component: () => import("@/views/test/TestPage.vue"),
  },
];

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
      path: "/admin",
      children: admin.map((v) => ({
        ...v,
        meta: {
          layout: "default",
        },
      })),
    },
    {
      path: "/user",
      children: user.map((v) => ({
        ...v,
        meta: {
          layout: "default",
        },
      })),
    },
    {
      path: "/notice",
      children: notice.map((v) => ({
        ...v,
        meta: {
          layout: "default",
        },
      })),
    },
    {
      path: "/test",
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

const router = createRouter({
  history: createWebHistory(),
  routes: routes(),
});

router.beforeEach((to, from, next) => {
  pendingRequests.forEach((cancelToken, requestId) => {
    try {
      cancelToken.cancel(`Route change: ${from.path} to ${to.path}`);
    } catch (e: unknown) {
      if (e instanceof CanceledError) {
        // ignore
      } else {
        throw e;
      }
    }
    pendingRequests.delete(requestId);
  });

  next();
});

export default router;
