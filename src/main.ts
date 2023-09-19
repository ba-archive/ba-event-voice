import { createApp } from "vue";
import {
  createVuesticEssential,
  VaModalPlugin,
  createVuestic,
} from "vuestic-ui";
import "./style.css";

import "vuestic-ui/css";
import App from "./App.vue";
import { createPinia } from "pinia";

createApp(App).use(createVuestic()).use(createPinia()).mount("#app");
