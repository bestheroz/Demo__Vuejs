<template>
  <div class="d-inline-flex">
    <v-radio-group
      v-model="type"
      class="required mr-4 mt-1"
      hide-details
      @update:model-value="login"
    >
      <v-radio :value="UserType.ADMIN" :label="UserType.ADMIN" />
      <v-radio :value="UserType.USER" :label="UserType.USER" />
    </v-radio-group>
    <v-chip-group disabled>
      <v-chip
        v-for="authority in info.authorities"
        :key="authority"
        size="small"
        >{{ authority }}</v-chip
      >
    </v-chip-group>
  </div>
</template>

<script setup lang="ts">
import axios, { type AxiosResponse } from "axios";
import { sha512 } from "js-sha512";
import { push } from "notivue";
import { ref } from "vue";
import { API_HOST } from "@/constants/envs";
import { UserType } from "@/definitions/selections";
import type { JwtTokens } from "@/definitions/types";
import { useAdminStore } from "@/stores/admin";
import { catchError } from "@/utils/apis";
import type { LoginRequest } from "@/views/login/LoginPage.vue";

const { info } = useAdminStore();

const type = ref(info.type);

const loading = ref(false);
const { saveTokens } = useAdminStore();
async function login() {
  loading.value = true;
  try {
    const { data } = await axios.post<LoginRequest, AxiosResponse<JwtTokens>>(
      `${API_HOST}api/v1/${type.value}s/login`,
      {
        loginId: "developer",
        password: sha512("1"),
      },
    );
    saveTokens(data);
    push.success("로그인 성공 => " + type.value);
  } catch (e) {
    catchError(e, true);
  } finally {
    loading.value = false;
  }
}
</script>
