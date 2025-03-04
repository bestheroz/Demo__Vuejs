import { createApp } from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import "@/scss/main.scss";
import router from "@/router";
import pinia from "@/stores";

const app = createApp(App);

app.use(router).use(pinia).use(vuetify);

app.mount("#app");
