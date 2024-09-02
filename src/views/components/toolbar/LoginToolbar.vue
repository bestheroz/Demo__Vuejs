<template>
  <div class="d-inline-flex">
    <v-radio-group
      v-model="type"
      class="required mr-4 mt-1"
      hide-details
      @change="login"
    >
      <v-radio :value="UserType.admin" :label="UserType.admin" />
      <v-radio :value="UserType.user" :label="UserType.user" />
    </v-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAdminStore } from "@/stores/admin";
import axios, { type AxiosResponse } from "axios";
import { API_HOST } from "@/constants/envs";
import { UserType } from "@/definitions/selections";
import { catchError } from "@/utils/apis";
import type { JwtTokens } from "@/definitions/types";
import type { LoginRequest } from "@/views/login/LoginPage.vue";

const { info } = useAdminStore();

const type = ref(info.type);

const loading = ref(false);
const { saveTokens } = useAdminStore();
async function login() {
  loading.value = true;
  try {
    const { data } = await axios.post<LoginRequest, AxiosResponse<JwtTokens>>(
      `${API_HOST}api/v1/${type.value.toLowerCase()}s/login`,
      { loginId: "developer", password: "1" },
    );
    saveTokens(data);
  } catch (e) {
    catchError(e, true);
  } finally {
    loading.value = false;
  }
}
</script>
