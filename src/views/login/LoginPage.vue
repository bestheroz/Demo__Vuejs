<template>
  <v-card class="text-center border-none" width="600">
    <v-card-title class="align-center">
      {{ PRODUCT_TITLE }}
    </v-card-title>
    <v-card-subtitle>ver {{ PRODUCT_VERSION }}</v-card-subtitle>
    <v-card-text style="border: 1px solid #0000001a">
      <v-form ref="refForm">
        <div class="d-inline-flex">
          <v-radio-group v-model="type" class="required mr-4 mt-1" hide-details>
            <v-radio :value="UserType.admin" :label="UserType.admin" />
            <v-radio :value="UserType.user" :label="UserType.user" />
          </v-radio-group>
        </div>
        <v-text-field
          v-model="loginId"
          :hide-details="false"
          :rules="[required]"
          label="아이디"
          name="loginId"
          class="required"
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
          @keyup.enter="login"
          @click:append="showPassword = !showPassword"
        />
        <v-btn
          color="primary"
          :loading="loading"
          block
          height="40"
          class="mb-4"
          @click="login"
        >
          로그인
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import axios, { type AxiosResponse } from "axios";
import { sha512 } from "js-sha512";
import { onMounted, onUnmounted, ref } from "vue";
import { API_HOST, PRODUCT_TITLE, PRODUCT_VERSION } from "@/constants/envs";
import { UserType } from "@/definitions/selections";
import type { JwtTokens } from "@/definitions/types";
import { useAdminStore } from "@/stores/admin";
import { catchError } from "@/utils/apis";
import { routerReplace } from "@/utils/commands";
import { required } from "@/utils/rules";

const loginId = ref("developer");
const password = ref("1");
const loading = ref(false);
const showPassword = ref(false);

const type = ref(UserType.admin);

export interface LoginRequest {
  loginId: string;
  password: string;
}

const refForm = ref();
const reloadable = ref(true);
async function login(): Promise<void> {
  const { valid } = await refForm.value?.validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  try {
    const { data } = await axios.post<LoginRequest, AxiosResponse<JwtTokens>>(
      `${API_HOST}api/v1/${type.value}s/login`,
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
    window.localStorage.getItem("demo-refreshToken") &&
    window.localStorage.getItem("demo-accessToken")
  ) {
    window.location.reload();
  }
}, 1_000);
onUnmounted(() => {
  pause();
});
onMounted(async () => {
  if (
    window.localStorage.getItem("demo-refreshToken") &&
    window.localStorage.getItem("demo-accessToken")
  ) {
    await routerReplace("/");
    return;
  }

  const { clearAdmin } = useAdminStore();
  clearAdmin();
  window.localStorage.clear();
  window.sessionStorage.clear();
});
</script>
