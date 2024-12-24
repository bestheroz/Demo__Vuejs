export const MenuType = {
  GROUP: "G",
  PAGE: "P",
  NEW_TAB: "NEW_TAB",
};
export type MenuTypeString = (typeof MenuType)[keyof typeof MenuType];

export const UserType = {
  ADMIN: "ADMIN",
  USER: "USER",
};
export type UserTypeString = (typeof UserType)[keyof typeof UserType];
