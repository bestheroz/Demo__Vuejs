import type { JwtTokens, TokenClaims } from "@/definitions/types";
import { jwtDecode } from "jwt-decode";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { getNewToken, signOut } from "@/utils/commands";
import { logger } from "@/utils/logger";
import { tokenStorage } from "@/utils/storage";

const initialTokens = (): JwtTokens => ({
  accessToken: "",
  refreshToken: "",
});

const initialInfo = (): TokenClaims => ({
  id: 0,
  loginId: "",
  name: "",
  type: "",
  managerFlag: false,
  authorities: [],
});

export const useAdminStore = defineStore(
  "admin",
  () => {
    const tokens = ref<JwtTokens>(initialTokens());
    const info = ref<TokenClaims>(initialInfo());

    const loggedIn = computed(
      () =>
        Boolean(tokens.value.accessToken) &&
        Boolean(info.value.id) &&
        tokens.value.accessToken === tokenStorage.getAccessToken() &&
        tokens.value.refreshToken === tokenStorage.getRefreshToken(),
    );

    const authorities = computed(() => info.value.authorities);

    function clearAdmin(): void {
      tokenStorage.clearTokens();
      tokens.value = initialTokens();
      info.value = initialInfo();
    }

    async function reIssueAccessToken(): Promise<void> {
      tokenStorage.removeAccessToken();
      tokens.value.accessToken = "";
      const newToken = await getNewToken();
      if (newToken) {
        saveTokens(newToken);
      }
    }

    function saveTokens(newTokens: JwtTokens): void {
      try {
        tokenStorage.setTokens(newTokens.accessToken, newTokens.refreshToken);
        tokens.value = { ...newTokens };
        const decoded = jwtDecode<TokenClaims>(newTokens.accessToken);
        info.value = {
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
    }

    return {
      tokens,
      info,
      loggedIn,
      authorities,
      clearAdmin,
      reIssueAccessToken,
      saveTokens,
    };
  },
  { persist: true },
);
