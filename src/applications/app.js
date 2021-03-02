import {
  NOT_LOADED,
  notBroken,
  notLoadError,
  isnotLoad,
  shouldBeActive,
  isloaded,
  isActive,
  isnotActive,
  shouldnotBeActive,
} from "./app.helper";
import { invoke } from "../navigation";
// const APPS = [];
export function getAppNames() {
  return APPS.map((app) => {
    return app.name;
  });
}
export const APPS = [];
export function getRawApps() {
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
export function registerApplication(
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
export function getAppsToload() {
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
export function getUnmountApps() {
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
export function getAppsToMount() {
  return APPS.filter(notBroken)
    .filter(notLoadError)
    .filter(isnotActive)
    .filter(shouldBeActive);
}
export function getMountedApps() {
  return APPS.filter(isActive).map((item) => item.name);
}
