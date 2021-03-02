(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
    ? define(["exports"], factory)
    : ((global =
        typeof globalThis !== "undefined" ? globalThis : global || self),
      factory((global.tinySingleSpa = {})));
})(this, function (exports) {
  "use strict";

  const NOT_LOADED = "NOT_LOADED";
  const LOAD_SOURCE_CODE = "LOAD_SOURCE_CODE";
  const NOT_BOOTSTRAPED = "NOT_BOOTSTRAPED";
  const BOOTSTRAPPING = "BOOTSTRAPPING";
  const NOT_MOUNTED = "NOT_MOUNTED";
  const MOUNTTING = "MOUNTTING";
  const MOUNTED = "MOUNTED";
  const UNMOUNTTING = "UNMOUNTTING";
  const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";
  const LOAD_ERROR = "LOAD_ERROR";
  const notBroken = function (app) {
    return app.status !== SKIP_BECAUSE_BROKEN;
  };
  const notLoadError = function (app) {
    return app.status !== LOAD_ERROR;
  };
  const isloaded = function (app) {
    return (
      app.status !== LOAD_ERROR &&
      app.status !== NOT_LOADED &&
      app.status !== LOAD_SOURCE_CODE
    );
  };
  const isnotLoad = function (app) {
    return !isloaded(app);
  };
  const shouldBeActive = function (app) {
    try {
      return app.activityWhen(window.location);
    } catch (error) {
      app.status = SKIP_BECAUSE_BROKEN;
      console.log(error);
    }
  };
  const shouldnotBeActive = function (app) {
    try {
      return !app.activityWhen(window.location);
    } catch (error) {
      app.status = SKIP_BECAUSE_BROKEN;
      console.log(error);
    }
  };
  const isActive = function (app) {
    return app.status === MOUNTED;
  };
  const isnotActive = function (app) {
    return !isActive(app);
  };

  function getAppNames() {
    return APPS.map((app) => {
      return app.name;
    });
  }
  const APPS = [];
  function getRawApps() {
    return [...APPS];
  }
  /**
   * 注册微服务Application
   * @param {sting} appName
   * @param {function<promise>} loadFunction
   * @param {function <Boolean>} activeWhenFunction
   * @param {object} props
   * @return {promise}
   */

  function registerApplication(
    appName,
    loadFunction,
    activeWhenFunction,
    customProps = {}
  ) {
    if (!appName || typeof appName !== "string") {
      throw new Error(`App name must be no-empty string`);
    }

    if (getAppNames().indexOf(appName) !== -1) {
      throw new Error("There is already an app declared with name " + appName);
    }

    if (typeof loadFunction !== "function") {
      throw new Error("the application or load function is required");
    }

    if (typeof customProps !== "object" || Array.isArray(customProps)) {
      throw new Error("the customProps must be a pure object");
    }

    if (typeof activeWhenFunction !== "function") {
      throw new Error("the activityWhen must be a function");
    }

    APPS.push({
      name: appName,
      loadApp: loadFunction,
      activityWhen: activeWhenFunction,
      status: NOT_LOADED,
      customProps,
      services: {},
    });
    return invoke();
  }
  /**
   * 获取满足加载条件的app
   * 1、没有加载中断
   * 2、没有加载错误
   * 3、没有被加载过
   * 4、满足app.activityWhen()
   * @return {*[]}
   */

  function getAppsToload() {
    let loadPromise = APPS.filter(notBroken)
      .filter(notLoadError)
      .filter(isnotLoad)
      .filter(shouldBeActive);
    return loadPromise;
  }
  /**
   * 获取满足加载条件的app
   * 1、没有加载中断
   * 2、没有加载错误
   * 3、已经加载过
   * 4、mouted的
   * 5、不满足app.activityWhen()
   * @return {*[]}
   */

  function getUnmountApps() {
    return APPS.filter(notBroken)
      .filter(isloaded)
      .filter(isActive)
      .filter(shouldnotBeActive);
  }
  /**
   * 获取满足加载条件的app
   * 1、没有加载中断
   * 2、没有加载错误
   * 3、加载过的
   * 4、没有被mounted
   * 5、满足app.activityWhen()
   * @return {*[]}
   * .filter(isloaded)
   */

  function getAppsToMount() {
    return APPS.filter(notBroken)
      .filter(notLoadError)
      .filter(isnotActive)
      .filter(shouldBeActive);
  }
  function getMountedApps() {
    return APPS.filter(isActive).map((item) => item.name);
  }

  const TIMEOUTS = {
    bootstrap: {
      milliseconds: 3000,
      rejectWhenTimeout: false,
    },
    mount: {
      milliseconds: 3000,
      rejectWhenTimeout: false,
    },
    unmount: {
      milliseconds: 3000,
      rejectWhenTimeout: false,
    },
  };
  function ensureTimeout(timeouts = {}) {
    return Object.assign({}, timeouts, TIMEOUTS);
  }

  /**
   *  生命周期 bootstrap
      生命周期 mount
      生命周期 unmount
   */
  const LIFECYLES = ["bootstrap", "mount", "unmount"];
  function smellLikePromise(p) {
    if (p instanceof Promise) {
      return true;
    }

    return (
      typeof p === "object" &&
      typeof p.then === "function" &&
      typeof p.catch === "function"
    );
  }
  function flattenLifecyleArray(lifecyles, description) {
    if (!Array.isArray(lifecyles)) {
      lifecyles = [lifecyles];
    }

    if (lifecyles.length === 0) {
      lifecyles = [() => {}];
    }

    return function (pros) {
      return new Promise((resolve, reject) => {
        function next(index) {
          let fn = lifecyles[index](pros);

          if (!smellLikePromise(fn)) {
            reject(`${description} at index ${index} did not return a promise`);
            return;
          } else {
            fn.then(() => {
              if (index >= lifecyles.length - 1) {
                resolve();
              } else {
                next(++index);
              }
            }).catch(reject);
          }
        }

        next(0);
      });
    };
  }
  function getProps(app) {
    return {
      name: app.name,
      ...app.customProps,
    };
  }

  function toLoadPromise(app) {
    if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
      return Promise.resolve(app);
    }

    app.status = LOAD_SOURCE_CODE;
    let loadPromise = app.loadApp(getProps(app));

    if (!smellLikePromise(loadPromise)) {
      app.status = SKIP_BECAUSE_BROKEN;
      return Promise.reject(new Error(""));
    }

    return loadPromise
      .then((appConfig) => {
        if (typeof appConfig !== "object") {
          throw new Error("");
        }

        let errors = [];
        LIFECYLES.forEach((lifecyle) => {
          if (!appConfig[lifecyle]) {
            errors.push(
              `${lifecyle}:must be a function or function array not empty`
            );
          }
        });

        if (errors.length) {
          app.status = SKIP_BECAUSE_BROKEN;
          console.log(errors);
          return;
        }

        app.status = NOT_BOOTSTRAPED;
        app.bootstrap = flattenLifecyleArray(
          appConfig.bootstrap,
          `app:${app.name} bootsstrapping`
        );
        app.mount = flattenLifecyleArray(
          appConfig.mount,
          `app:${app.name} mountting`
        );
        app.unmount = flattenLifecyleArray(
          appConfig.unmount,
          `app:${app.name} unmountting`
        );
        app.timeouts = ensureTimeout(app.timeouts);
        return app;
      })
      .catch((e) => {
        app.status = LOAD_ERROR;
        return app;
      });
  }

  function unmountPromise(app) {
    if (app.status !== MOUNTED) {
      return Promise.resolve(app);
    }

    app.status = UNMOUNTTING; // return reasonableTimeout(
    //   app.unmount(getProps(app)),
    //   `app: ${app.name} unmountting`,
    //   app.timeouts.unmount
    // )

    return app
      .unmount(getProps(app))
      .then(() => {
        app.status = NOT_MOUNTED;
        return app;
      })
      .catch((e) => {
        console.log(e);
        app.status = SKIP_BECAUSE_BROKEN;
        return app;
      });
  }

  function toBootstrapPromise(app) {
    console.log("toBootstrapPromise");

    if (app.status !== NOT_BOOTSTRAPED) {
      return Promise.resolve(app);
    }

    app.status = BOOTSTRAPPING; // return reasonableTimeout(
    //   app.bootstrap(getProps(app)),
    //   `app: ${app.name} bootstrapping`,
    //   app.timeouts.bootstrap
    // )

    return app
      .bootstrap(getProps(app))
      .then(() => {
        app.status = NOT_MOUNTED;
        return app;
      })
      .catch((e) => {
        console.log(e);
        app.status = SKIP_BECAUSE_BROKEN;
        return app;
      });
  }

  function toMountPromise(app) {
    console.log("mountApp");

    if (app.status !== NOT_MOUNTED) {
      return Promise.resolve(app);
    }

    app.status = MOUNTTING; // return reasonableTimeout(
    //   app.mount(getProps(app)),
    //   `app: ${app.name} moutting`,
    //   app.timeouts.mount
    // )

    return app
      .mount(getProps(app))
      .then(() => {
        app.status = MOUNTED;
        return app;
      })
      .catch((e) => {
        console.log(e);
        app.status = SKIP_BECAUSE_BROKEN;
        return app;
      });
  }

  const HIJACK_EVENTS_NAME = /^(popstate|hashchange)$/i;
  const EVENTPOOL = {
    popstate: [],
    hashchange: [],
  };

  let route = function () {
    invoke([], arguments);
  };

  window.addEventListener("popstate", route);
  window.addEventListener("hashchange", route);
  const originAddEventListener = window.addEventListener;
  const originRemoveEventListener = window.removeEventListener;

  window.addEventListener = function (type, handler) {
    if (
      type &&
      HIJACK_EVENTS_NAME.test(type) &&
      typeof handler === "function"
    ) {
      EVENTPOOL[type].indexof(handler) === -1 && EVENTPOOL[type].push(handler);
    } else {
      originAddEventListener.apply(this, arguments);
    }
  };

  window.removeEventListener = function (type, handler) {
    if (
      type &&
      HIJACK_EVENTS_NAME.test(type) &&
      typeof handler === "function"
    ) {
      let list = EVENTPOOL[type];
      EVENTPOOL[type] =
        list.indexof(handler) > -1
          ? list.filter((han) => han !== handler)
          : EVENTPOOL[type];
    } else {
      originRemoveEventListener.apply(this, arguments);
    }
  };

  let originPopstate = window.history.popstate;
  let originReplacestate = window.history.replaceState;

  window.history.popstate = function (state, title, url) {
    let result = originPopstate.apply(this, arguments);
    route(mockPopStateEvent(state));
    return result;
  };

  window.history.replaceState = function (state, title, url) {
    let result = originReplacestate.apply(this, arguments);
    route(mockPopStateEvent(state));
    return result;
  };

  function mockPopStateEvent(state) {
    return new PopStateEvent("popstate", {
      state,
    });
  }

  function callCapturedEvents(events) {
    if (!events) {
      return;
    }

    if (Array.isArray(events)) {
      events = events[0];
    }

    let name = events.type;

    if (!HIJACK_EVENTS_NAME.test(name)) {
      return;
    }

    EVENTPOOL[name].forEach((handler) => handler.apply(window, eventArgs));
  }

  let loadAppUnderway = false;
  const pendingPromise = [];
  function invoke(pendings = [], events) {
    if (loadAppUnderway) {
      // 添加到pendingPromise中等待执行
      return new Promise((resolve, reject) => {
        pendingPromise.push({
          resolve,
          reject,
          events,
        });
      });
    }

    if (isStart()) {
      performAppChanges();
    } else {
      loadApps();
    } // load app;

    function loadApps() {
      let promiseLoadApps = getAppsToload().map(toLoadPromise);
      console.log("promiseLoadApps:", promiseLoadApps);
      Promise.all(promiseLoadApps)
        .then(() => {
          callAllLocationEvent();
          return finish();
        })
        .catch((e) => {
          callAllLocationEvent();
          console.log(e);
        });
    } // 启动app

    function performAppChanges() {
      // unmout app
      let unmountApps = getUnmountApps();
      console.log("unmountApps:", unmountApps);
      let unmountAppsPromise = Promise.all(unmountApps.map(unmountPromise)); // load app
      // let loadApps = getAppsToload();
      // console.log("loadApps:", loadApps);
      // let loadPromises = loadApps.map((app) => {
      //   return toLoadPromise(app)
      //     .then((app) => toBootstrapPromise(app))
      //     .then(() => unmountAppsPromise)
      //     .then(() => toMountPromise(app));
      // });
      // mount app

      let mountApps = getAppsToMount();
      console.log("mountApps:", mountApps); // mountApps = mountApps.filter((app) => loadApps.indexOf(app) === -1);

      let mountPromise = mountApps.map((app) => {
        return toLoadPromise(app)
          .then(() => toBootstrapPromise(app))
          .then(() => unmountAppsPromise)
          .then(() => toMountPromise(app));
      });
      return unmountAppsPromise.then(
        () => {
          // let loadAndMountPromise = mountPromise;
          // console.log("loadAndMountPromise:", loadAndMountPromise);
          return Promise.all(mountPromise).then(
            () => {
              callAllLocationEvent();
              finish();
            },
            (ex) => {
              pendings && pendings.forEach((item) => item.reject(ex));
              throw ex;
            }
          );
        },
        (e) => {
          callAllLocationEvent();
          console.log(e);
          throw e;
        }
      );
    }

    function finish() {
      let resoveValue = getMountedApps();

      if (pendings) {
        pendings.forEach((pend) => {
          pend.resolve(resoveValue);
        });
      }

      loadAppUnderway = false;

      if (pendingPromise.length) {
        let backUp = pendingPromise;
        pendingPromise = [];
        return invoke(backUp);
      }

      return resoveValue;
    }

    function callAllLocationEvent() {
      pendings &&
        pendings.length &&
        pendings.forEach((pend) => {
          pend.events && callCapturedEvents(pend.events);
        });
      events && callCapturedEvents(events);
    }
  }

  let startFlag = false;
  function start() {
    if (!startFlag) {
      startFlag = true;
      return invoke();
    }
  }
  function isStart() {
    return startFlag;
  }

  exports.getRawApps = getRawApps;
  exports.registerApplication = registerApplication;
  exports.start = start;

  Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=tinySingleSpa.js.map
