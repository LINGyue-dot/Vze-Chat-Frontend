/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-10-26 19:46:19
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-10-26 21:00:15
 * @Description:
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "ant-design-vue/dist/antd.css";

import Antd from "ant-design-vue";
import { installQucickPreview } from "@/components/quick-preview";

const app = createApp(App);
installQucickPreview(app);

app.use(store).use(router).use(Antd).mount("#app");
