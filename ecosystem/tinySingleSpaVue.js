/* eslint-disable */
const PRE_FIX_ID = "#tinySingleSpaVue_";
function checkElement(boxId) {
  var ele = boxId + " #mss_container";
  var div = null;

  if (!document.querySelector(boxId)) {
    div = document.createElement("div");
    div.id = boxId.slice(1);
    document.body.appendChild(div);
  }

  if (!document.querySelector(ele)) {
    div = document.createElement("div");
    div.id = "mss_container";
    document.querySelector(boxId).appendChild(div);
  }

  return ele;
}
function emptyElement(boxId) {
  let el = document.querySelector(boxId);
  if (el) {
    el.innerHTML = "";
  }
}
function bootstrap() {
  return Promise.resolve();
  // 模拟超时
  // return new Promise((resove, reject) => {
  //   setTimeout(() => {
  //     resove();
  //   }, 5000);
  // });
}
function mount(opts, mountedInstances, props) {
  let el = opts.appOptions.el;
  let boxId = PRE_FIX_ID + props.name ? props.name : "aa";
  if (!el || String(el).indexOf(boxId) === 0) {
    opts.appOptions.el = checkElement(boxId);
  }
  mountedInstances.instance = new opts.Vue(opts.appOptions);
  if (mountedInstances.instance.bind) {
    mountedInstances.instance = mountedInstances.instance.bind(
      mountedInstances.instance
    );
  }
  return Promise.resolve();
}
function unmount(opts, mountedInstances, props) {
  console.log("unmout");
  console.log(mountedInstances.instance.$el);
  mountedInstances.instance.$destroy();
  mountedInstances.instance.$el.innerHTML = "";
  mountedInstances.instance.$el.setAttribute("id", opts.appOptions.el.slice(1));
  delete mountedInstances.instance;
  emptyElement(PRE_FIX_ID + props.name);
  return Promise.resolve();
}
const defaultOption = {
  Vue: null,
  appOptions: {},
  template: null,
};
function tinySingleSpaVue(options) {
  if (typeof options !== "object") {
    throw new Error("tinySingleSpaVue options must be object");
  }
  let opts = Object.assign({}, defaultOption, options);
  if (!opts.Vue) {
    throw new Error("tinySingleSpaVue must be passed a Vue");
  }
  if (!options.appOptions) {
    throw new Error("tinySingleSpaVue must be passed a appOptions");
  }
  let mountedInstances = {};
  return {
    bootstrap: bootstrap.bind(null, opts, mountedInstances),
    mount: mount.bind(null, opts, mountedInstances),
    unmount: unmount.bind(null, opts, mountedInstances),
  };
}
export default tinySingleSpaVue;
