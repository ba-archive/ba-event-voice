import { createApp } from "vue";
import { createVuesticEssential, VaModalPlugin } from "vuestic-ui";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";

createApp(App)
  .use(
    createVuesticEssential({
      plugins: {
        VaModalPlugin,
      },
    })
  )
  .use(createPinia())
  .mount("#app");
