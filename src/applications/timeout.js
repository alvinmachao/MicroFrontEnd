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
export function ensureTimeout(timeouts = {}) {
  return Object.assign({}, timeouts, TIMEOUTS);
}
export function reasonableTimeout(lifecyle, description, timeouts) {
  return new Promise((resolve, reject) => {
    let finish = false;
    lifecyle
      .then((data) => {
        finish = true;
        resolve(data);
      })
      .catch(() => {
        finish = true;
        reject();
      });
    setTimeout(() => {
      if (finish) {
        return;
      }
      let error = `${description} did not resolve or reject for ${timeouts.milliseconds} milliseconds`;
      if (timeouts.rejectWhenTimeout) {
        throw new Error(error);
      } else {
        console.log(error);
      }
    }, timeouts.milliseconds);
  });
}
