<script setup lang="ts">
import type { JwtTokens, LoginRequest } from "@/definitions/types";
import axios, { type AxiosResponse } from "axios";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { API_HOST } from "@/constants/envs";
import { UserType } from "@/definitions/selections";
import { useAdminStore } from "@/stores/admin";
import { catchError } from "@/utils/apis";
import { sha512 } from "@/utils/crypto";

const { info } = useAdminStore();

const type = ref(info.type);

const loading = ref(false);
const { saveTokens } = useAdminStore();
async function login() {
  loading.value = true;
  try {
    const hashedPassword = await sha512("1");
    toast.promise(
      axios.post<LoginRequest, AxiosResponse<JwtTokens>>(
        `${API_HOST}api/v1/${type.value}s/login`,
        {
          loginId: "developer",
          password: hashedPassword,
        },
      ),
      {
        success: ({ data }: AxiosResponse<JwtTokens>) => {
          saveTokens(data);
          return "로그인 성공 => " + type.value;
        },
        error(e: unknown) {
          return catchError(e, true);
        },
      },
    );
  } finally {
    loading.value = false;
  }
}
</script>

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
