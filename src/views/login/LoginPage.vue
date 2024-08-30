<template>
  <v-card class="text-center border-none" width="600">
    <v-card-title class="align-center">
      {{ PRODUCT_TITLE }}
    </v-card-title>
    <v-card-subtitle>ver {{ PRODUCT_VERSION }}</v-card-subtitle>
    <v-card-text style="border: 1px solid #0000001a">
      <v-form ref="refForm">
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
          {{ t("signIn.signIn") }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { routerReplace } from "@/utils/commands";
import { onMounted, onUnmounted, ref } from "vue";
import axios, { type AxiosResponse } from "axios";
import { API_HOST, PRODUCT_TITLE, PRODUCT_VERSION } from "@/constants/envs";
import { useIntervalFn } from "@vueuse/core";
import { required } from "@/utils/rules";
import { useAdminStore } from "@/stores/admin";
import { toast } from "vue3-toastify";

const { t } = useI18n();

const loginId = ref("developer");
const password = ref("1");
const loading = ref(false);
const showPassword = ref(false);

interface LoginRequest {
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
    const { code, data, message } = (
      await axios.post<LoginRequest, AxiosResponse<LoginData>>(
        `${API_HOST}api/v1/admin/login`,
        {
          loginId: loginId.value,
          password: password.value,
        },
      )
    ).data;
    if (code === "S000") {
      reloadable.value = false;
      const { saveTokens } = useAdminStore();
      saveTokens(data.jwtTokens);

      reloadable.value = true;
      await routerReplace("/");
    } else {
      toast.error(message);
    }
  } catch (e) {
    console.error(e);
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
