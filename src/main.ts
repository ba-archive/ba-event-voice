import { createApp } from "vue";
import {
  createVuesticEssential,
  VaModalPlugin,
  VaDropdownPlugin,
} from "vuestic-ui";
import "./style.css";
import "material-design-icons-iconfont/dist/material-design-icons.min.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import "vuestic-ui/css";
import App from "./App.vue";
import { createPinia } from "pinia";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .use(
    createVuesticEssential({
      plugins: {
        VaDropdownPlugin,
        VaModalPlugin,
      },
    })
  )
  .use(pinia)
  .mount("#app");
