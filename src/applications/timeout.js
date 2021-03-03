const TIMEOUTS = {
  bootstrap: {
    // 默认bootstrap时间3s
    milliseconds: 3000,
    // 超时是否reject
    rejectWhenTimeout: false,
  },
  mount: {
    // 默认mount时间3s
    milliseconds: 3000,
    // 超时是否reject
    rejectWhenTimeout: false,
  },
  unmount: {
    // 默认unmount时间3s
    milliseconds: 3000,
    // 超时是否reject
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
        reject();
        throw new Error(error);
      } else {
        console.log(error);
      }
    }, timeouts.milliseconds);
  });
}
