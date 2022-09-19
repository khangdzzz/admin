import { createApp } from "vue";
import App from "@/modules/base/App.vue";
import { i18n } from "./i18n";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "ant-design-vue/dist/antd.less";
import { router } from "./routes";
import { createPinia } from "pinia";
import { ScreenLayout } from "@/routes/screen-layouts";
import { MessengerType } from '@/modules/base/models/messenger-type.enum'
import AuthLayout from "@/modules/auth/layouts/AuthLayout.vue";
import DefaultLayout from "@/modules/base/layouts/DefaultLayout.vue";
import mitt from "mitt";

const app = createApp(App);
const pinia = createPinia();
const emitter = mitt();
const messenger = (title: string, message: string, type: MessengerType, callback: (() => void) | undefined): void => {
    const data = {
        type,
        title,
        message,
        callback
    };
    emitter.emit("ShowModal", data)
}

app.component(ScreenLayout.AUTH_LAYOUT, AuthLayout);
app.component(ScreenLayout.DEFAULT_LAYOUT, DefaultLayout);

app.use(i18n);
app.use(Antd);
app.use(pinia);
app.use(router);
app.provide("messenger", messenger);
app.provide("emitter", emitter);
app.mount("#app");
