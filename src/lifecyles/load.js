import {
  NOT_LOADED,
  LOAD_ERROR,
  LOAD_SOURCE_CODE,
  NOT_BOOTSTRAPED,
  SKIP_BECAUSE_BROKEN,
} from "../applications/app.helper";
import { ensureTimeout } from "../applications/timeout";
import {
  smellLikePromise,
  LIFECYLES,
  flattenLifecyleArray,
  getProps,
} from "./helper";

export function toLoadPromise(app) {
  console.log(`load the ${app.name} current status is `, app.status);
  console.log(tinySingleSpa.getRawApps());
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
      console.log(
        `load the ${app.name} completed, current status is `,
        app.status
      );
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

// export function toLoadPromise(app) {
//   app = tinySingleSpa.getRawApps().find((item) => item.name === app.name);
//   console.log(`load the ${app.name} current status is `, app.status);
//   console.log(tinySingleSpa.getRawApps());
//   if (app.status !== NOT_LOADED && app.status !== LOAD_ERROR) {
//     return Promise.resolve(app);
//   }
//   app.status = LOAD_SOURCE_CODE;
//   let loadPromise = app.loadApp(getProps(app));
//   if (!smellLikePromise(loadPromise)) {
//     app.status = SKIP_BECAUSE_BROKEN;
//     return Promise.reject(new Error(""));
//   }
//   return new Promise((resovle, reject) => {
//     loadPromise
//       .then((appConfig) => {
//         if (typeof appConfig !== "object") {
//           throw new Error("");
//         }
//         console.log(
//           `load the ${app.name} completed, current status is `,
//           app.status
//         );
//         let errors = [];
//         LIFECYLES.forEach((lifecyle) => {
//           if (!appConfig[lifecyle]) {
//             errors.push(
//               `${lifecyle}:must be a function or function array not empty`
//             );
//           }
//         });
//         if (errors.length) {
//           app.status = SKIP_BECAUSE_BROKEN;
//           console.log(errors);
//           reject(app);
//           return;
//         }
//         app.status = NOT_BOOTSTRAPED;
//         app.bootstrap = flattenLifecyleArray(
//           appConfig.bootstrap,
//           `app:${app.name} bootsstrapping`
//         );
//         app.mount = flattenLifecyleArray(
//           appConfig.mount,
//           `app:${app.name} mountting`
//         );
//         app.unmount = flattenLifecyleArray(
//           appConfig.unmount,
//           `app:${app.name} unmountting`
//         );
//         app.timeouts = ensureTimeout(app.timeouts);
//         resovle(app);
//         return app;
//       })
//       .catch((e) => {
//         app.status = LOAD_ERROR;
//         reject(app);
//         return app;
//       });
//   });
// }

// function pro() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log(1);
//       resolve(100);
//     }, 1000);
//   });
// }
// function test() {
//   return pro().then((data) => {
//     console.log("2");
//     return data + 100;
//   });
// }
// test()
//   .then((data) => {
//     console.log(3);
//     console.log(data);
//     return data + 100;
//   })
//   .then((data) => {
//     console.log(4);
//     console.log(data);
//     return data + 100;
//   });
