import { createApp } from "vue";
import { createVuesticEssential, VaModalPlugin } from "vuestic-ui";
import "./style.css";
import App from "./App.vue";

createApp(App)
  .use(
    createVuesticEssential({
      plugins: {
        VaModalPlugin,
      },
    })
  )
  .mount("#app");
