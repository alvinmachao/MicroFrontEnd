import {
  MOUNTED,
  NOT_MOUNTED,
  UNMOUNTTING,
  SKIP_BECAUSE_BROKEN,
} from "../applications/app.helper";
import { reasonableTimeout } from "../applications/timeout";
import { getProps } from "./helper";

export function unmountPromise(app) {
  console.log(`unmount the ${app.name} current status is `, app.status);
  console.log(tinySingleSpa.getRawApps());
  if (app.status !== MOUNTED) {
    return Promise.resolve(app);
  }
  app.status = UNMOUNTTING;
  return (
    reasonableTimeout(
      app.unmount(getProps(app)),
      `app: ${app.name} unmountting`,
      app.timeouts.unmount
    )
      // return app
      //   .unmount(getProps(app))
      .then(() => {
        app.status = NOT_MOUNTED;
        return app;
      })
      .catch((e) => {
        console.log(e);
        app.status = SKIP_BECAUSE_BROKEN;
        return app;
      })
  );
}
