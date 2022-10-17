import { createApp, h } from "vue";
import App from "@/modules/base/App.vue";
import { i18n } from "./i18n";
import Antd, { Spin } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "ant-design-vue/dist/antd.less";
import { router } from "./routes";
import { createPinia } from "pinia";
import { ScreenLayout } from "@/routes/screen-layouts";
import AuthLayout from "@/modules/auth/layouts/AuthLayout.vue";
import DefaultLayout from "@/modules/base/layouts/DefaultLayout.vue";
import mitt from "mitt";
import MessengerParamModel from "@/modules/base/models/messenger-param.model";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";
import LoadingSpinnerVue from "./modules/base/components/LoadingSpinner.vue";

const app = createApp(App);
const pinia = createPinia();
const emitter = mitt();
const messenger = (param: MessengerParamModel): void => {
  emitter.emit("ShowModal", param);
};

//antdesign global config
Spin.setDefaultIndicator({
  indicator: h(LoadingSpinnerVue, {
    style: {
      fontSize: "60px"
    },
    spin: true
  })
});

app.component(ScreenLayout.AUTH_LAYOUT, AuthLayout);
app.component(ScreenLayout.DEFAULT_LAYOUT, DefaultLayout);

app.use(i18n);
app.use(Antd);
app.use(pinia);
app.use(router);
app.use(OpenLayersMap);
app.provide("messenger", messenger);
app.provide("emitter", emitter);
app.mount("#app");
