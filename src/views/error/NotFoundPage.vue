<template>
  <v-card class="text-center w-100 error-page pa-3">
    <v-img
      src="@/assets/images/illustrations/404-illustration.svg"
      max-height="400"
      cover
    />
    <div class="text-h3 mt-10">How did you get here?</div>
    <div class="my-3">
      Sorry we can't seem to find the page you're looking for.
    </div>
    <v-btn color="primary" block size="large" @click="replace('/')">
      Send me Back
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const { replace } = useRouter();
</script>

<style>
.error-page {
  max-width: 500px;
}
</style>
