import {
  getAppsToload,
  getUnmountApps,
  getAppsToMount,
  getMountedApps,
} from "../applications/app";
import { isStart } from "../start";
import { toLoadPromise } from "../lifecyles/load";
import { unmountPromise } from "../lifecyles/unmount";
import { toBootstrapPromise } from "../lifecyles/bootstrap";
import { toMountPromise } from "../lifecyles/mount";
import { callCapturedEvents } from "../navigation/hijackLocation";
let loadAppUnderway = false;
const pendingPromise = [];

export function invoke(pendings = [], events) {
  if (loadAppUnderway) {
    // 添加到pendingPromise中等待执行
    return new Promise((resolve, reject) => {
      pendingPromise.push({ resolve, reject, events });
    });
  }
  if (isStart()) {
    performAppChanges();
  } else {
    loadApps();
  }
  // load app;
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
  }
  // 启动app
  function performAppChanges() {
    // unmout app
    let unmountApps = getUnmountApps();
    console.log("unmountApps:", unmountApps);
    let unmountAppsPromise = Promise.all(unmountApps.map(unmountPromise));
    // load app
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
    console.log("mountApps:", mountApps);
    // mountApps = mountApps.filter((app) => loadApps.indexOf(app) === -1);
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
