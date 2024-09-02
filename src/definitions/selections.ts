export const MenuType = {
  GROUP: "G",
  // REGISTER: "R",
  PAGE: "P",
  // INQUIRY: "I",
  // HELP: "H",
  NEW_TAB: "NEW_TAB",
};
export type MenuTypeString = (typeof MenuType)[keyof typeof MenuType];

export const UserType = {
  admin: "admin",
  user: "user",
};
export type UserTypeString = (typeof UserType)[keyof typeof UserType];
