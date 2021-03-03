/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import tinySingleSpaVue from "../../../ecosystem/tinySingleSpaVue";

// Vue.config.productionTip = false;

// if (process.env.NODE_ENV === "development") {
//   new Vue({
//     render: (h) => h(App),
//   }).$mount("#app");
// }
const lifecyles = tinySingleSpaVue({
  Vue: Vue,
  appOptions: {
    el: "#subApp",
    render: (h) => h(App),
  },
});
export const bootstrap = lifecyles.bootstrap;
export const mount = lifecyles.mount;
export const unmount = lifecyles.unmount;
export default lifecyles;
