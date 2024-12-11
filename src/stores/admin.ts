import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import type { JwtTokens, TokenClaims } from "@/definitions/types";
import { getNewToken, signOut } from "@/utils/commands";
type AdminInfo = {
  tokens: JwtTokens;
  info: TokenClaims;
};

export const useAdminStore = defineStore("admin", {
  state: (): AdminInfo => ({
    tokens: {
      accessToken: "",
      refreshToken: "",
    },
    info: {
      id: 0,
      loginId: "",
      name: "",
      type: "",
      managerFlag: false,
      authorities: [],
    },
  }),
  getters: {
    loggedIn: (state: AdminInfo): boolean =>
      !!state.tokens.accessToken &&
      !!state.info.id &&
      !!localStorage.getItem("demo-accessToken") &&
      !!localStorage.getItem("demo-refreshToken"),
    authorities: (state: AdminInfo): string[] => state.info.authorities,
  },
  actions: {
    clearAdmin(): void {
      window.localStorage.removeItem("demo-accessToken");
      window.localStorage.removeItem("demo-refreshToken");
      this.tokens = { accessToken: "", refreshToken: "" };
      this.info.id = 0;
      this.info.loginId = "";
      this.info.name = "";
      this.info.type = "";
      this.info.managerFlag = false;
      this.info.authorities = [];
    },

    async reIssueAccessToken(): Promise<void> {
      window.localStorage.removeItem("demo-accessToken");
      this.tokens.accessToken = "";
      const newToken = await getNewToken();
      if (newToken) {
        this.saveTokens(newToken);
      }
    },

    saveTokens(tokens: JwtTokens): void {
      try {
        window.localStorage.setItem("demo-accessToken", tokens.accessToken);
        window.localStorage.setItem("demo-refreshToken", tokens.refreshToken);
        this.tokens = { ...tokens };
        const decoded = jwtDecode<TokenClaims>(tokens.accessToken);
        this.info.id = decoded.id;
        this.info.loginId = decoded.loginId;
        this.info.name = decoded.name;
        this.info.type = decoded.type;
        this.info.managerFlag = decoded.managerFlag;
        this.info.authorities = decoded.authorities;
      } catch (e: unknown) {
        signOut().then();
      }
    },
  },
  persist: true,
});
