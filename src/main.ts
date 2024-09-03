import { createApp } from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import "notivue/notification.css"; // Only needed if using built-in notifications
import "notivue/animations.css"; // Only needed if using built-in animations
import "@/scss/main.scss";
import pinia from "@/stores";
import router from "@/router";

import { createNotivue } from "notivue";

const app = createApp(App);

app.use(router).use(pinia).use(vuetify);

const notivue = createNotivue({
  position: "top-right",
  notifications: {
    success: {
      duration: 2_000,
    },
    info: {
      duration: 4_000,
    },
    warning: {
      duration: 5_000,
    },
    error: {
      duration: 10_000,
    },
  },
});
app.use(notivue);

app.mount("#app");
