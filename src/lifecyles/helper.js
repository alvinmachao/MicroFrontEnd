/**
 *  生命周期 bootstrap
    生命周期 mount
    生命周期 unmount
 */
export const LIFECYLES = ["bootstrap", "mount", "unmount"];
export function smellLikePromise(p) {
  if (p instanceof Promise) {
    return true;
  }
  return (
    typeof p === "object" &&
    typeof p.then === "function" &&
    typeof p.catch === "function"
  );
}
export function flattenLifecyleArray(lifecyles, description) {
  if (!Array.isArray(lifecyles)) {
    lifecyles = [lifecyles];
  }
  if (lifecyles.length === 0) {
    lifecyles = [
      () => {
        Promise.resolve();
      },
    ];
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
export function getProps(app) {
  return {
    name: app.name,
    ...app.customProps,
  };
}
