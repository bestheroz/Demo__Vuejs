<template>
  <DialogConfirm
    v-for="(item, _index) in items"
    :key="_index"
    :uuid="item.uuid"
    :title="item.title"
    :content="item.content"
    :width="item.width"
    :resolver="item.resolver"
    :confirm-button-title="item.confirmButtonTitle"
    :cancel-button-title="item.cancelButtonTitle"
  />
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useConfirmStore } from "@/stores/confirm";
import DialogConfirm from "@/views/components/dialog/DialogConfirm.vue";

const { items } = storeToRefs(useConfirmStore());
</script>
