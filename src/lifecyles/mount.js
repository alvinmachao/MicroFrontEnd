import {
  MOUNTED,
  MOUNTTING,
  SKIP_BECAUSE_BROKEN,
  NOT_MOUNTED,
} from "../applications/app.helper";
import { reasonableTimeout } from "../applications/timeout";
import { getProps } from "./helper";

export function toMountPromise(app) {
  console.log(`mount the ${app.name} current status is `, app.status);
  console.log(tinySingleSpa.getRawApps());

  if (app.status !== NOT_MOUNTED) {
    return Promise.resolve(app);
  }
  app.status = MOUNTTING;
  return (
    reasonableTimeout(
      app.mount(getProps(app)),
      `app: ${app.name} moutting`,
      app.timeouts.mount
    )
      // return app
      //   .mount(getProps(app))
      .then(() => {
        app.status = MOUNTED;
        return app;
      })
      .catch((e) => {
        console.log(e);
        app.status = SKIP_BECAUSE_BROKEN;
        return app;
      })
  );
}
