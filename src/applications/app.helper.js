export const NOT_LOADED = "NOT_LOADED";
export const LOAD_SOURCE_CODE = "LOAD_SOURCE_CODE";
export const NOT_BOOTSTRAPED = "NOT_BOOTSTRAPED";
export const BOOTSTRAPPING = "BOOTSTRAPPING";
export const NOT_MOUNTED = "NOT_MOUNTED";
export const MOUNTTING = "MOUNTTING";
export const MOUNTED = "MOUNTED";
export const UNMOUNTTING = "UNMOUNTTING";
export const UPDATEING = "UPDATEING";
export const SKIP_BECAUSE_BROKEN = "SKIP_BECAUSE_BROKEN";
export const LOAD_ERROR = "LOAD_ERROR";
export const notBroken = function (app) {
  return app.status !== SKIP_BECAUSE_BROKEN;
};
export const notLoadError = function (app) {
  return app.status !== LOAD_ERROR;
};
export const isloaded = function (app) {
  return (
    app.status !== LOAD_ERROR &&
    app.status !== NOT_LOADED &&
    app.status !== LOAD_SOURCE_CODE
  );
};
export const isnotLoad = function (app) {
  return !isloaded(app);
};
export const shouldBeActive = function (app) {
  try {
    return app.activityWhen(window.location);
  } catch (error) {
    app.status = SKIP_BECAUSE_BROKEN;
    console.log(error);
  }
};
export const shouldnotBeActive = function (app) {
  try {
    return !app.activityWhen(window.location);
  } catch (error) {
    app.status = SKIP_BECAUSE_BROKEN;
    console.log(error);
  }
};

export const isActive = function (app) {
  return app.status === MOUNTED;
};
export const isnotActive = function (app) {
  return !isActive(app);
};
