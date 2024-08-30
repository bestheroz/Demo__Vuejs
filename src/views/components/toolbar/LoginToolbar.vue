<template>
  <div class="d-inline-flex">
    <v-radio-group v-model="info.type" class="required mr-4 mt-1" hide-details>
      <v-radio
        :value="UserType.ADMIN"
        :label="UserType.ADMIN"
        @click="login(UserType.ADMIN)"
      />
      <v-radio
        :value="UserType.USER"
        :label="UserType.USER"
        @click="login(UserType.USER)"
      />
    </v-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAdminStore } from "@/stores/admin";
import { storeToRefs } from "pinia";
import axios from "axios";
import { API_HOST } from "@/constants/envs";
import { UserType, type UserTypeString } from "@/definitions/selections";
import { toast } from "vue3-toastify";

const { info } = storeToRefs(useAdminStore());

const loading = ref(false);
const { clearAdmin, saveTokens } = useAdminStore();
async function login(type: UserTypeString) {
  clearAdmin();
  loading.value = true;
  try {
    const data = (
      await axios.post<{ accessToken: string; refreshToken: string }>(
        `${API_HOST}api/v1/${type.toLowerCase()}/login`,
        modelValue.value,
      )
    ).data;
    saveTokens({
      access: data.returnData?.accessToken ?? "",
      refresh: data.returnData?.refreshToken ?? "",
    });
  } catch (e) {
    catchError(e);
  } finally {
    loading.value = false;
  }
}
</script>
