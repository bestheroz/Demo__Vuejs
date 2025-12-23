<script setup lang="ts">
import type { User, UserCreate } from "@/views/user/management/types";
import { useDebounceFn } from "@vueuse/core";
import { sha512 } from "js-sha512";
import { storeToRefs } from "pinia";
import { ref, useTemplateRef } from "vue";
import { Authority } from "@/definitions/authorities";
import { useAdminStore } from "@/stores/admin";
import { useConfirmStore } from "@/stores/confirm";
import { getApi, postApi, putApi, stringifyParams } from "@/utils/apis";
import { isEmpty, maxLength, minLength, required } from "@/utils/rules";
import { toastWarning } from "@/utils/toaster";
import CreatedUpdatedBar from "@/views/components/history/CreatedUpdatedBar.vue";

const props = defineProps<{
  modelValue: UserCreate;
}>();

const emit = defineEmits<{
  (e: "click:cancel"): void;
  (e: "save"): void;
}>();

const { authorities } = storeToRefs(useAdminStore());

const loading = ref(false);

const newFlag = !props.modelValue.id;

const password = ref("");
const passwordErrorMessages = ref<string[]>([]);

const refForm = useTemplateRef<{ validate: () => Promise<{ valid: boolean }> }>("refForm");
async function save(): Promise<void> {
  if (!isEmpty(errorText.value) || !isEmpty(passwordErrorMessages.value)) {
    toastWarning("입력 항목을 확인해주세요.");
    return;
  }

  const formValidation = await refForm.value?.validate();
  if (!formValidation?.valid) {
    toastWarning("입력 항목을 확인해주세요.");
    return;
  }
  if (newFlag) {
    await createItem();
  } else {
    await updateItem();
  }
}

const { confirmCreate, confirmUpdate } = useConfirmStore();
async function createItem() {
  if (!(await confirmCreate())) {
    return;
  }
  const { success } = await postApi<UserCreate, User>(
    "api/v1/users",
    {
      ...props.modelValue,
      password: props.modelValue.password
        ? sha512(props.modelValue.password)
        : undefined,
    },
    { refLoading: loading },
  );
  if (success) {
    emit("save");
    emit("click:cancel");
  }
}
async function updateItem() {
  if (!(await confirmUpdate())) {
    return;
  }
  const { success } = await putApi<UserCreate, User>(
    `api/v1/users/${props.modelValue.id}`,
    {
      ...props.modelValue,
      password: props.modelValue.password
        ? sha512(props.modelValue.password)
        : undefined,
    },
    { refLoading: loading },
  );
  if (success) {
    emit("save");
    emit("click:cancel");
  }
}

const checkLoading = ref(false);
const errorText = ref<string[]>([]);
function checkExistsLoginId() {
  checkLoading.value = true;
  debouncedCheckExistsLoginId();
}
const debouncedCheckExistsLoginId = useDebounceFn(async (): Promise<void> => {
  try {
    errorText.value = [];
    if (!props.modelValue.loginId) {
      return;
    }
    const { data } = await getApi<boolean>(
      `api/v1/users/check-login-id?${stringifyParams({
        loginId: props.modelValue.loginId,
        userId: props.modelValue.id,
      })}`,
    );
    if (!data) {
      errorText.value = ["이미 존재하는 아이디입니다."];
    }
  } finally {
    checkLoading.value = false;
  }
}, 500);

function onInputPassword() {
  if (
    isEmpty(props.modelValue.password) ||
    password.value === props.modelValue.password
  ) {
    passwordErrorMessages.value = [];
  } else {
    passwordErrorMessages.value = ["비밀번호가 일치하지 않습니다."];
  }
}
</script>

<template>
  <v-bottom-sheet
    max-width="100%"
    @keydown.esc="emit('click:cancel')"
    @update:model-value="(val) => !val && emit('click:cancel')"
  >
    <v-card>
      <v-card-title> {{ newFlag ? "추가" : "수정" }} </v-card-title>
      <v-card-text>
        <v-form ref="refForm">
          <v-row dense>
            <v-col cols="2">
              <v-text-field
                v-model="modelValue.loginId"
                label="로그인 아이디"
                class="required"
                :variant="newFlag ? 'filled' : 'plain'"
                :disabled="!newFlag"
                :rules="[required]"
                :loading="checkLoading"
                :error-messages="errorText"
                :color="errorText.length === 0 ? 'success' : 'error'"
                :append-inner-icon="
                  newFlag
                    ? errorText.length === 0
                      ? 'mdi-check'
                      : 'mdi-alphabetical-variant-off'
                    : ''
                "
                @update:model-value="newFlag ? checkExistsLoginId() : undefined"
              />
            </v-col>
            <v-col cols="2">
              <input
                name="fake"
                style="width: 0; height: 0"
                class="d-flex"
                autocomplete="nope"
              />
              <input
                name="modelValue.password"
                type="password"
                style="width: 0; height: 0"
                class="d-flex"
                autocomplete="nope"
              />
              <v-text-field
                v-model="modelValue.password"
                type="password"
                autocomplete="nope"
                label="비밀번호"
                :rules="
                  newFlag
                    ? [required, minLength(8), maxLength(30)]
                    : [minLength(8), maxLength(30)]
                "
                :class="{ required: newFlag }"
                @update:model-value="onInputPassword"
              />
            </v-col>
            <v-col cols="2">
              <input
                name="fake"
                style="width: 0; height: 0"
                class="d-flex"
                autocomplete="nope"
              />
              <input
                name="password"
                type="password"
                style="width: 0; height: 0"
                class="d-flex"
                autocomplete="nope"
              />
              <v-text-field
                v-model="password"
                type="password"
                autocomplete="nope"
                label="비밀번호 확인"
                :error-messages="passwordErrorMessages"
                :rules="
                  modelValue.password
                    ? [required, minLength(8), maxLength(30)]
                    : []
                "
                :class="{ required: modelValue.password }"
                @update:model-value="onInputPassword"
              />
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="modelValue.name"
                label="이름"
                :rules="[required]"
                class="required"
              />
            </v-col>
            <v-col cols="2">
              <v-switch
                v-model="modelValue.useFlag"
                label="사용 여부"
                class="required"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <CreatedUpdatedBar :model-value="modelValue" />
        <v-btn
          color="primary"
          width="100"
          variant="plain"
          density="default"
          size="x-large"
          height="40"
          @click="emit('click:cancel')"
          >닫기</v-btn
        >
        <v-btn
          v-if="authorities.includes(Authority.USER_EDIT)"
          color="primary"
          :loading="loading"
          variant="flat"
          density="default"
          size="x-large"
          height="40"
          width="100"
          @click="save"
          >저장</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>
