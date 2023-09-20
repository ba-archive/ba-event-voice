import { createApp } from "vue";
import {
  createVuesticEssential,
  VaModalPlugin,
  createVuestic,
} from "vuestic-ui";
import "./style.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "vuestic-ui/css";
import App from "./App.vue";
import { createPinia } from "pinia";

createApp(App)
  .use(createVuestic())
  .use(createPinia().use(piniaPluginPersistedstate))
  .mount("#app");
