import type { Drawer } from "@/definitions/types";
import { MenuType } from "@/definitions/selections";
export const DRAWERS: Drawer[] = [
  {
    name: "공지",
    type: MenuType.GROUP,
    icon: "mdi-file-sign",
    children: [
      {
        name: "관리",
        type: MenuType.PAGE,
        url: "/notice/management",
      },
    ],
  },
  {
    name: "관리자",
    type: MenuType.GROUP,
    icon: "mdi-file-sign",
    children: [
      {
        name: "관리",
        type: MenuType.PAGE,
        url: "/admin/management",
      },
    ],
  },
  {
    name: "사용자",
    type: MenuType.GROUP,
    icon: "mdi-file-sign",
    children: [
      {
        name: "관리",
        type: MenuType.PAGE,
        url: "/user/management",
      },
    ],
  },
  {
    name: "테스트",
    type: MenuType.GROUP,
    icon: "mdi-file-sign",
    children: [
      {
        name: "통합",
        type: MenuType.PAGE,
        url: "/test/integration",
      },
    ],
  },
];
