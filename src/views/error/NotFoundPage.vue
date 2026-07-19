<script setup lang="ts">
import { useRouter } from "vue-router";
import illustration404 from "@/assets/images/illustrations/404-illustration.svg";

const { replace } = useRouter();
</script>

<template>
  <v-card class="text-center w-100 error-page pa-3">
    <v-img :src="illustration404" max-height="400" cover />
    <div class="text-display-small mt-10">How did you get here?</div>
    <div class="my-3">
      Sorry we can't seem to find the page you're looking for.
    </div>
    <v-btn color="primary" block size="large" @click="replace('/')">
      Send me Back
    </v-btn>
  </v-card>
</template>

<style>
.error-page {
  max-width: 500px;
}
</style>
