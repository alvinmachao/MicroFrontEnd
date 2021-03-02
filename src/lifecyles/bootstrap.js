import {
  BOOTSTRAPPING,
  NOT_BOOTSTRAPED,
  SKIP_BECAUSE_BROKEN,
  NOT_MOUNTED,
} from "../applications/app.helper";
import { reasonableTimeout } from "../applications/timeout";
import { getProps } from "./helper";

export function toBootstrapPromise(app) {
  console.log("toBootstrapPromise");
  if (app.status !== NOT_BOOTSTRAPED) {
    return Promise.resolve(app);
  }
  app.status = BOOTSTRAPPING;
  // return reasonableTimeout(
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
