import Vue from "vue";
import App from "./App.vue";
import * as tinySingleSpa from "../../../dist/tinySingleSpa";
import { getManifest } from "../src/utils";
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

tinySingleSpa.registerApplication(
  "vue-app-1",
  () => {
    return getManifest("app1-api/stats.json", "app").then(() => {
      console.log("load" + "vue-app-1");
      console.log("load", window.vueApp1);
      return window.vueApp1;
    });
  },
  (location) => {
    return location.hash === "#/app1";
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
      console.log("load", window.vueApp2);
      return window.vueApp2;
    });
  },
  (location) => {
    return location.hash === "#/app2";
  },
  {
    vue: true,
  }
);
tinySingleSpa.start();
window.tinySingleSpa = tinySingleSpa;
