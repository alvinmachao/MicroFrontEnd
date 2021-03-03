/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import tinySingleSpaVue from "../../../ecosystem/tinySingleSpaVue";

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
// Vue.config.productionTip = false;

// new Vue({
//   render: (h) => h(App),
// }).$mount("#app");
