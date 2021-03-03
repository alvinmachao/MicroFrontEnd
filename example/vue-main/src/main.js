import Vue from "vue";
import App from "./App.vue";
import * as tinySingleSpa from "../../../dist/tinySingleSpa";
import { getManifest } from "../src/utils";
Vue.config.productionTip = false;
window.tinySingleSpa = tinySingleSpa;
new Vue({
  render: (h) => h(App),
}).$mount("#app");

tinySingleSpa.registerApplication(
  "vue-app-1",
  () => {
    return getManifest("app1-api/stats.json", "app").then(() => {
      return window.vueApp1;
    });
  },
  (location) => {
    return location.pathname.indexOf("/app1") === 0;
  },
  {
    vue: true,
  }
);
tinySingleSpa.registerApplication(
  "vue-app-2",
  () => {
    return getManifest("app2-api/stats.json", "app").then(() => {
      console.log("load" + "vue-app-2");
      return window.vueApp2;
    });
  },
  (location) => {
    return location.pathname.indexOf("/app2") === 0;
  },
  {
    vue: true,
  }
);
tinySingleSpa.start();
window.tinySingleSpa = tinySingleSpa;
