import type { JwtTokens, TokenClaims } from "@/definitions/types";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { getNewToken, signOut } from "@/utils/commands";
import { logger } from "@/utils/logger";
import { tokenStorage } from "@/utils/storage";

interface AdminInfo {
  tokens: JwtTokens;
  info: TokenClaims;
}

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
      Boolean(state.tokens.accessToken) &&
      Boolean(state.info.id) &&
      state.tokens.accessToken === tokenStorage.getAccessToken() &&
      state.tokens.refreshToken === tokenStorage.getRefreshToken(),
    authorities: (state: AdminInfo): string[] => state.info.authorities,
  },
  actions: {
    clearAdmin(): void {
      tokenStorage.clearTokens();
      this.$reset();
    },

    async reIssueAccessToken(): Promise<void> {
      tokenStorage.removeAccessToken();
      this.tokens.accessToken = "";
      const newToken = await getNewToken();
      if (newToken) {
        this.saveTokens(newToken);
      }
    },

    saveTokens(tokens: JwtTokens): void {
      try {
        tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
        this.tokens = { ...tokens };
        const decoded = jwtDecode<TokenClaims>(tokens.accessToken);
        this.info = {
          id: decoded.id,
          loginId: decoded.loginId,
          name: decoded.name,
          type: decoded.type,
          managerFlag: decoded.managerFlag,
          authorities: decoded.authorities,
        };
      } catch (error: unknown) {
        logger.error("Failed to decode JWT token:", error);
        void signOut();
      }
    },
  },
  persist: true,
});
