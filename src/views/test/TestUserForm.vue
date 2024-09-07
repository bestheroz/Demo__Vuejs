<template>
  <v-card>
    <v-card-title>
      <span>
        유저
        <v-btn
          v-if="authorities.includes(Authority.USER_EDIT)"
          color="primary"
          :loading="loading"
          variant="plain"
          class="text-h5"
          @click="run"
          >모두 테스트</v-btn
        >
      </span>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <TestRunForm ref="refTestRunForm1" title="조회" :run-fn="run1" />
        <TestRunForm ref="refTestRunForm2" title="추가" :run-fn="run2" />
        <TestRunForm
          ref="refTestRunForm3"
          :disabled="!createdId"
          title="상세조회"
          :run-fn="run3"
        />
        <TestRunForm
          ref="refTestRunForm4"
          :disabled="!createdId"
          title="ID 중복확인"
          :run-fn="run4"
        />
        <TestRunForm
          ref="refTestRunForm5"
          :disabled="!createdId"
          title="로그인"
          :run-fn="run5"
        />
        <TestRunForm
          ref="refTestRunForm6"
          :disabled="!createdId"
          title="수정"
          :run-fn="run6"
        />
        <TestRunForm
          ref="refTestRunForm7"
          title="수정 후 로그인"
          :disabled="!createdId"
          :run-fn="run7"
        />
        <TestRunForm
          ref="refTestRunForm8"
          title="비밀번호 변경"
          :disabled="!createdId || !token"
          :run-fn="run8"
        />
        <TestRunForm
          ref="refTestRunForm9"
          title="비밀번호 변경 후 로그인"
          :disabled="!createdId"
          :run-fn="run9"
        />
        <TestRunForm
          ref="refTestRunForm10"
          title="유저 토큰 갱신"
          :disabled="!token"
          :run-fn="run10"
        />
        <TestRunForm
          ref="refTestRunForm11"
          title="유저 로그아웃"
          :disabled="!token"
          :run-fn="run11"
        />
        <TestRunForm
          ref="refTestRunForm12"
          :disabled="!createdId"
          title="삭제"
          :run-fn="run12"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Authority } from "@/definitions/authorities";
import { storeToRefs } from "pinia";
import { useAdminStore } from "@/stores/admin";
import { ref } from "vue";
import TestRunForm from "@/views/test/TestRunForm.vue";
import { deleteApi, getApi, postApi, putApi } from "@/utils/apis";
import type { UserCreate } from "@/views/user/management/types";
import type { LoginRequest } from "@/views/login/LoginPage.vue";
import type { JwtTokens } from "@/definitions/types";
import axios from "axios";
import { API_HOST } from "@/constants/envs";

const { authorities } = storeToRefs(useAdminStore());

const loading = ref(false);

const refTestRunForm1 = ref();
const refTestRunForm2 = ref();
const refTestRunForm3 = ref();
const refTestRunForm4 = ref();
const refTestRunForm5 = ref();
const refTestRunForm6 = ref();
const refTestRunForm7 = ref();
const refTestRunForm8 = ref();
const refTestRunForm9 = ref();
const refTestRunForm10 = ref();
const refTestRunForm11 = ref();
const refTestRunForm12 = ref();
async function run() {
  const [, success2] = await Promise.all([
    refTestRunForm1.value.run(),
    refTestRunForm2.value.run(),
  ]);
  if (!success2) return;

  const [, , , success6] = await Promise.all([
    refTestRunForm3.value.run(),
    refTestRunForm4.value.run(),
    refTestRunForm5.value.run(),
    refTestRunForm6.value.run(),
  ]);
  if (!success6) return;
  const [, success8] = await Promise.all([
    refTestRunForm7.value.run(),
    refTestRunForm8.value.run(),
  ]);
  if (!success8) return;
  if (!(await refTestRunForm9.value.run())) return;
  if (!(await refTestRunForm10.value.run())) return;
  if (!(await refTestRunForm11.value.run())) return;
  if (!(await refTestRunForm12.value.run())) return;
}

const createdId = ref<number | undefined>(undefined);

async function run1() {
  return await getApi("api/v1/users?page=1&pageSize=10");
}
async function run2() {
  const response = await postApi<UserCreate>("api/v1/users", {
    loginId: "(Test)loginId",
    name: "(Test)name",
    password: "(Test)password",
    useFlag: true,
    authorities: [Authority.NOTICE_VIEW],
  });
  if (response.success) {
    createdId.value = response.data.id;
  }
  return response;
}
async function run3() {
  return await getApi(`api/v1/users/${createdId.value}`);
}
async function run4() {
  const response = await getApi(
    `api/v1/users/check-login-id?loginId=(Test)loginId&userId=${createdId.value}`,
  );
  return {
    success: response.success && response.data === true,
    data: response.data,
  };
}
const token = ref<JwtTokens | undefined>(undefined);
async function run5() {
  const response = await postApi<LoginRequest, JwtTokens>(
    "api/v1/users/login",
    {
      loginId: "(Test)loginId",
      password: "(Test)password",
    },
  );
  if (response.success) {
    token.value = response.data;
  }
  return response;
}
async function run6() {
  return await putApi(`api/v1/users/${createdId.value}`, {
    loginId: "(Test)loginId_updated",
    name: "(Test)name_updated",
    password: "(Test)password_updated",
    useFlag: true,
    authorities: [Authority.NOTICE_VIEW, Authority.USER_VIEW],
  });
}
async function run7() {
  const response = await postApi<LoginRequest, JwtTokens>(
    `${API_HOST}api/v1/users/login`,
    {
      loginId: "(Test)loginId_updated",
      password: "(Test)password_updated",
    },
  );
  if (response.success) {
    token.value = response.data;
  }
  return response;
}
async function run8() {
  const response = await axios.patch(
    `${API_HOST}api/v1/users/${createdId.value}/password`,
    {
      oldPassword: "(Test)password_updated",
      newPassword: "(Test)password_updated_new",
    },
    {
      headers: {
        Authorization: `Bearer ${token.value?.accessToken}`,
      },
    },
  );
  return {
    success: response.status === 200,
    data: response.data,
  };
}
async function run9() {
  const response = await postApi<LoginRequest, JwtTokens>(
    "api/v1/users/login",
    {
      loginId: "(Test)loginId_updated",
      password: "(Test)password_updated_new",
    },
  );
  if (response.success) {
    token.value = response.data;
  }
  return response;
}
async function run10() {
  const response = await axios.get<JwtTokens>(
    `${API_HOST}api/v1/users/renew-token`,
    {
      headers: {
        AuthorizationR: `Bearer ${token.value?.refreshToken}`,
      },
    },
  );
  if (response.status === 200) {
    token.value = response.data;
  }
  return {
    success: response.status === 200,
    data: response.data,
  };
}
async function run11() {
  const response = await axios.delete(`${API_HOST}api/v1/users/logout`, {
    headers: {
      Authorization: `Bearer ${token.value?.accessToken}`,
    },
  });
  if (response.status === 204) {
    token.value = undefined;
  }
  return {
    success: response.status === 204,
    data: { status: response.status, statusText: response.statusText },
  };
}
async function run12() {
  const response = await deleteApi(`api/v1/users/${createdId.value}`);
  if (response.success) {
    createdId.value = undefined;
    token.value = undefined;
  }
  return {
    success: response.status === 204,
    data: { status: response.status, statusText: response.statusText },
  };
}
</script>
