<template>
  <v-bottom-sheet
    max-width="100%"
    @keydown.esc="emits('click:cancel')"
    @update:model-value="(val) => !val && emits('click:cancel')"
  >
    <v-card>
      <v-card-title> {{ newFlag ? "추가" : "수정" }} </v-card-title>
      <v-card-text>
        <v-form ref="refForm">
          <v-row dense>
            <v-col cols="10">
              <v-text-field
                v-model="modelValue.title"
                label="제목"
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
            <v-col cols="12">
              <v-textarea
                v-model="modelValue.content"
                label="내용"
                :rows="20"
                :rules="[required]"
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
          @click="emits('click:cancel')"
          >닫기</v-btn
        >
        <v-btn
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

<script setup lang="ts">
import { ref } from "vue";
import { postApi, putApi } from "@/utils/apis";
import { required } from "@/utils/rules";
import { useConfirmStore } from "@/stores/confirm";
import CreatedUpdatedBar from "@/views/components/history/CreatedUpdatedBar.vue";
import type { Notice } from "@/views/notice/management/types";
import { push } from "notivue";

const props = defineProps<{
  modelValue: Notice;
}>();

const emits = defineEmits<{
  (e: "click:cancel");
  (e: "save");
}>();

const loading = ref(false);

const newFlag = !props.modelValue.id;

const refForm = ref();
async function save(): Promise<void> {
  const { valid } = await refForm.value?.validate();
  if (!valid) {
    push.warning("입력 항목을 확인해주세요.");
    return;
  }
  newFlag ? await createItem() : await updateItem();
}

const { confirmCreate, confirmUpdate } = useConfirmStore();
async function createItem() {
  if (!(await confirmCreate())) {
    return;
  }
  loading.value = true;
  try {
    const { status } = await postApi<Notice, Notice>(
      "api/v1/notices",
      props.modelValue,
    );
    if (Math.floor(status / 100) === 2) {
      emits("save");
      emits("click:cancel");
    }
  } finally {
    loading.value = false;
  }
}
async function updateItem() {
  if (!(await confirmUpdate())) {
    return;
  }
  loading.value = true;
  try {
    const { status } = await putApi<Notice, Notice>(
      `api/v1/notices/${props.modelValue.id}`,
      props.modelValue,
    );
    loading.value = false;
    if (Math.floor(status / 100) === 2) {
      emits("save");
      emits("click:cancel");
    }
  } finally {
    loading.value = false;
  }
}
</script>
