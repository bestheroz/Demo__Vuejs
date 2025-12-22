import type { Drawer } from "@/definitions/types";
import { Authority } from "@/definitions/authorities";
import { MenuType } from "@/definitions/selections";
export const DRAWERS: Drawer[] = [
  {
    name: "공지",
    type: MenuType.GROUP,
    icon: "mdi-bell",
    children: [
      {
        name: "관리",
        type: MenuType.PAGE,
        url: "/notice/management",
        authority: Authority.NOTICE_VIEW,
      },
    ],
  },
  {
    name: "관리자",
    type: MenuType.GROUP,
    icon: "mdi-shield-account",
    children: [
      {
        name: "관리",
        type: MenuType.PAGE,
        url: "/admin/management",
        authority: Authority.ADMIN_VIEW,
      },
    ],
  },
  {
    name: "사용자",
    type: MenuType.GROUP,
    icon: "mdi-account",
    children: [
      {
        name: "관리",
        type: MenuType.PAGE,
        url: "/user/management",
        authority: Authority.USER_VIEW,
      },
    ],
  },
  {
    name: "테스트",
    type: MenuType.GROUP,
    icon: "mdi-test-tube",
    children: [
      {
        name: "통합",
        type: MenuType.PAGE,
        url: "/test/integration",
      },
    ],
  },
];
