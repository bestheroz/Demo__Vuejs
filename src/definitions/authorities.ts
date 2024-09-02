export const Authority = {
  ADMIN_VIEW: "ADMIN_VIEW",
  ADMIN_EDIT: "ADMIN_EDIT",

  USER_VIEW: "USER_VIEW",
  USER_EDIT: "USER_EDIT",

  NOTICE_VIEW: "NOTICE_VIEW",
  NOTICE_EDIT: "NOTICE_EDIT",
};
export type AuthorityString = (typeof Authority)[keyof typeof Authority];
