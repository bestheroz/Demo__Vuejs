import { createApp } from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import "notivue/notification.css"; // Only needed if using built-in notifications
import "notivue/animations.css"; // Only needed if using built-in animations
import "@/scss/main.scss";
import pinia from "@/stores";
import router from "@/router";

import { createNotivue } from "notivue";

const notivue = createNotivue(/* options */);
const app = createApp(App);

app.use(router).use(pinia).use(vuetify);
app.use(notivue);
app.mount("#app");
