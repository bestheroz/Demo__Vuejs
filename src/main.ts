import { createApp } from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import pinia from "@/stores";
import "@/scss/main.scss";

const app = createApp(App);

app.use(router).use(pinia).use(vuetify);

app.mount("#app");
