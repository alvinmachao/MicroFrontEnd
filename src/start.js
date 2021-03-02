import { invoke } from "./navigation";
let startFlag = false;
export function start() {
  if (!startFlag) {
    startFlag = true;
    return invoke();
  }
}
export function isStart() {
  return startFlag;
}
