<script lang="ts" setup>
import type { ConfirmResolveResponse } from "@/definitions/types";

const {
  uuid,
  title,
  content,
  cancelButtonTitle = "취소",
  confirmButtonTitle = "확인",
  width = "400px",
  resolver,
} = defineProps<{
  uuid: string;
  title?: string;
  content: string;
  cancelButtonTitle?: string;
  confirmButtonTitle?: string;
  width?: string | number;
  resolver: (value: ConfirmResolveResponse) => void;
}>();
</script>

<template>
  <v-dialog
    model-value
    :width="width"
    @keydown.esc="resolver({ uuid: uuid, value: false })"
    @keydown.enter="resolver({ uuid: uuid, value: true })"
  >
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text v-text="content"> </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          width="100"
          variant="plain"
          density="default"
          size="x-large"
          height="40"
          @click="resolver({ uuid: uuid, value: false })"
        >
          {{ cancelButtonTitle }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          density="default"
          size="x-large"
          height="40"
          width="100"
          @click="resolver({ uuid: uuid, value: true })"
        >
          {{ confirmButtonTitle }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
