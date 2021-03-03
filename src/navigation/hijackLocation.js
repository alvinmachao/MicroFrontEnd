import { invoke } from "./index";
const HIJACK_EVENTS_NAME = /^(popstate|hashchange)$/i;
const EVENTPOOL = {
  popstate: [],
  hashchange: [],
};
export const reroute = function () {
  invoke([], arguments);
};

window.addEventListener("popstate", reroute);
window.addEventListener("hashchange", reroute);
const originAddEventListener = window.addEventListener;
const originRemoveEventListener = window.removeEventListener;
window.addEventListener = function (type, handler) {
  if (type && HIJACK_EVENTS_NAME.test(type) && typeof handler === "function") {
    EVENTPOOL[type].indexof(handler) === -1 && EVENTPOOL[type].push(handler);
  } else {
    originAddEventListener.apply(this, arguments);
  }
};
window.removeEventListener = function (type, handler) {
  if (type && HIJACK_EVENTS_NAME.test(type) && typeof handler === "function") {
    let list = EVENTPOOL[type];
    EVENTPOOL[type] =
      list.indexof(handler) > -1
        ? list.filter((han) => han !== handler)
        : EVENTPOOL[type];
  } else {
    originRemoveEventListener.apply(this, arguments);
  }
};
let originPushState = window.history.pushState;
let originReplacestate = window.history.replaceState;
window.history.pushState = function (state, title, url) {
  let result = originPushState.apply(this, arguments);
  reroute(mockPopStateEvent(state));
  return result;
};
window.history.replaceState = function (state, title, url) {
  let result = originReplacestate.apply(this, arguments);
  reroute(mockPopStateEvent(state));
  return result;
};

function mockPopStateEvent(state) {
  return new PopStateEvent("popstate", { state });
}

export function callCapturedEvents(events) {
  if (!events) {
    return;
  }
  if (Array.isArray(events)) {
    events = events[0];
  }
  let name = events.type;
  if (!HIJACK_EVENTS_NAME.test(name)) {
    return;
  }
  EVENTPOOL[name].forEach((handler) => handler.apply(window, eventArgs));
}
