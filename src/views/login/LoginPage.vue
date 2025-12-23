<script lang="ts" setup>
import type { JwtTokens, LoginRequest } from "@/definitions/types";
import { useIntervalFn } from "@vueuse/core";
import axios, { type AxiosResponse } from "axios";
import { sha512 } from "js-sha512";
import { onMounted, onUnmounted, ref } from "vue";
import { API_HOST, PRODUCT_TITLE, PRODUCT_VERSION } from "@/constants/envs";
import { UserType } from "@/definitions/selections";
import { useAdminStore } from "@/stores/admin";
import { catchError } from "@/utils/apis";
import { routerReplace } from "@/utils/commands";
import { isAlphanumeric, required } from "@/utils/rules";
import { tokenStorage } from "@/utils/storage";

const loginId = ref("developer");
const password = ref("1");
const loading = ref(false);
const showPassword = ref(false);

const type = ref(UserType.ADMIN);

const refForm = ref<{ validate: () => Promise<{ valid: boolean }> }>();
const reloadable = ref(true);
async function login(): Promise<void> {
  const formValidation = await refForm.value?.validate();
  if (!formValidation?.valid) {
    return;
  }
  loading.value = true;
  try {
    const { data } = await axios.post<LoginRequest, AxiosResponse<JwtTokens>>(
      `${API_HOST}api/v1/${type.value.toLowerCase()}s/login`,
      {
        loginId: loginId.value,
        password: sha512(password.value),
      },
    );
    reloadable.value = false;
    const { saveTokens } = useAdminStore();
    saveTokens(data);

    reloadable.value = true;
    await routerReplace("/");
  } catch (e) {
    catchError(e, true);
  } finally {
    loading.value = false;
  }
}

const { pause } = useIntervalFn(() => {
  if (
    reloadable.value &&
    tokenStorage.getRefreshToken() &&
    tokenStorage.getAccessToken()
  ) {
    window.location.reload();
  }
}, 1_000);
onUnmounted(() => {
  pause();
});
onMounted(async () => {
  if (tokenStorage.getRefreshToken() && tokenStorage.getAccessToken()) {
    await routerReplace("/");
    return;
  }

  const { clearAdmin } = useAdminStore();
  clearAdmin();
  tokenStorage.clearTokens();
  window.sessionStorage.clear();
});
</script>

<template>
  <v-card class="text-center border-none" width="600">
    <v-card-title class="align-center">
      {{ PRODUCT_TITLE }}
    </v-card-title>
    <v-card-subtitle>ver {{ PRODUCT_VERSION }}</v-card-subtitle>
    <v-card-text style="border: 1px solid #0000001a">
      <v-form
        ref="refForm"
        role="form"
        aria-label="로그인 폼"
        @submit.prevent="login"
      >
        <div class="d-inline-flex">
          <v-radio-group
            v-model="type"
            class="required mr-4 mt-1"
            hide-details
            aria-label="사용자 유형 선택"
          >
            <v-radio :value="UserType.ADMIN" :label="UserType.ADMIN" />
            <v-radio :value="UserType.USER" :label="UserType.USER" />
          </v-radio-group>
        </div>
        <v-text-field
          v-model="loginId"
          :hide-details="false"
          :rules="[required, isAlphanumeric]"
          label="아이디"
          name="loginId"
          class="required"
          autocomplete="username"
          aria-describedby="loginId-help"
          maxlength="50"
          @keyup.enter="login"
        />
        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :hide-details="false"
          :rules="[required]"
          label="비밀번호"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          class="required"
          autocomplete="current-password"
          maxlength="100"
          :aria-label="
            showPassword ? '비밀번호 (현재 표시됨)' : '비밀번호 (숨김)'
          "
          @keyup.enter="login"
          @click:append="showPassword = !showPassword"
        />
        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
          :disabled="loading"
          block
          height="40"
          class="mb-4"
          :aria-label="loading ? '로그인 처리 중...' : '로그인'"
        >
          {{ loading ? "처리중..." : "로그인" }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
