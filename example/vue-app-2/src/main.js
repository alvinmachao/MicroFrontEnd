import Vue from "vue";
import App from "./App.vue";
import tinySingleSpaVue from "../../../ecosystem/tinySingleSpaVue";
// Vue.config.productionTip = false;

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
// new Vue({
//   render: h => h(App),
// }).$mount('#app')
