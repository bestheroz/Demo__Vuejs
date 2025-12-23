<script lang="ts" setup>
import { useIntervalFn } from "@vueuse/core";
import dayjs from "dayjs";
import { onMounted, onUnmounted, ref } from "vue";
import { PRODUCT_TITLE } from "@/constants/envs";

const intervalForNow = useIntervalFn(() => {
  now.value = dayjs().format("YYYY년 MM월 DD일 HH시 mm분 ss초");
}, 1_000);
const intervalForChangeColor = useIntervalFn(() => {
  color.value = getRandomColor();
}, 10_000);
const now = ref("");
const color = ref("");

function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

onUnmounted(() => {
  intervalForNow.pause();
  intervalForChangeColor.pause();
});
onMounted(() => {
  now.value = dayjs().format("YYYY년 MM월 DD일 HH시 mm분 ss초");
  color.value = getRandomColor();
});
</script>
<template>
  <div class="flex-grow-1 align-center justify-center d-flex flex-column">
    <h1
      style="font-size: 3rem; color: rgb(var(--v-theme-primary))"
      v-text="PRODUCT_TITLE"
    />
    <h1 :style="`color: ${color}`" v-text="now" />
  </div>
</template>
