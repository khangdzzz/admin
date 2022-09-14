import { createApp } from "vue";
import App from "@/modules/base/App.vue";
import { i18n } from "./i18n";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "ant-design-vue/dist/antd.less";
import { router } from "./routes";
import { createPinia } from "pinia";
import { ScreenLayout } from "@/routes/screen-layouts";

import AuthLayout from "@/modules/auth/layouts/AuthLayout.vue";
import DefaultLayout from "@/modules/base/layouts/DefaultLayout.vue";

const app = createApp(App);
const pinia = createPinia();

app.component(ScreenLayout.AUTH_LAYOUT, AuthLayout);
app.component(ScreenLayout.DEFAULT_LAYOUT, DefaultLayout);

app.use(i18n);
app.use(Antd);
app.use(pinia);
app.use(router);
app.mount("#app");
