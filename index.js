import * as dependencyTracker from "./dependencyTracker.js";

function observe(obj) {
  Object.keys(obj).forEach((key) => {
    let temp = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        dep.depend();
        return temp;
      },
      set(newValue) {
        temp = newValue;
        dep.notify();
      },
    });
  });
  return obj;
}

const state = observe({
  count: 0,
});

const dep = new dependencyTracker.Dep();

dependencyTracker.autorun(() => {
  state.count;
});

state.count++;
state.count++;
