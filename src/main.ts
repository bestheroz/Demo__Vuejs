import { createApp, vaporInteropPlugin } from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import router from "@/router";
import pinia from "@/stores";
import "@/scss/main.scss";

const app = createApp(App);

// Vapor SFC(<script setup vapor>)와 VDOM 컴포넌트(Vuetify 등) 상호 운용
app.use(vaporInteropPlugin).use(router).use(pinia).use(vuetify);

app.mount("#app");
