import { createApp } from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import "vue3-toastify/dist/index.css";
import "@/scss/main.scss";
import pinia from "@/stores";
import router from "@/router";

import { pendingRequests } from "@/utils/apis";
import { CanceledError } from "axios";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";

const app = createApp(App);

router.beforeEach((to, from, next) => {
  pendingRequests.forEach((cancelToken, requestId) => {
    try {
      cancelToken.cancel(`Route change: ${from.path} to ${to.path}`);
    } catch (e: unknown) {
      if (e instanceof CanceledError) {
        // ignore
      } else {
        throw e;
      }
    }
    pendingRequests.delete(requestId);
  });

  next();
});

app.use(router).use(pinia).use(vuetify).mount("#app");

app.use(Vue3Toastify, {
  pauseOnFocusLoss: false,
  theme: "dark",
} as ToastContainerOptions);
