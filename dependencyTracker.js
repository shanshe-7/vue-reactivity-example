export class Dep {
  constructor() {
    this.subscribers = new Set();
  }
  depend() {
    if (activeUpdate) {
      this.subscribers.add(activeUpdate);
    }
  }

  notify() {
    this.subscribers.forEach((fn) => {
      return fn();
    });
  }
}

let activeUpdate = null;

export function autorun(fn) {
  (function wrappedUpdate() {
    activeUpdate = wrappedUpdate;
    fn();
    activeUpdate = null;
  })();
}
