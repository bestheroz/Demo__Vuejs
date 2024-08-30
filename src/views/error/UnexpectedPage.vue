<template>
  <v-card class="text-center w-100 error-page pa-3">
    <v-img
      src="@/assets/images/illustrations/500-illustration.svg"
      max-height="400"
      contain
    />
    <div class="text-h3 mt-10">OOPS! Something went wrong here</div>
    <div class="my-3">Our experts are working to fix the issue.</div>
    <v-btn color="primary" block size="large" @click="router.back()">
      Send me back
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style>
.error-page {
  max-width: 500px;
}
</style>
