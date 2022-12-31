const targetMap = new WeakMap();
let activeEffect = null;
let product = reactive({ quantity: 12, price: 7 });
let total = 0;
let salePrice = ref(0);

function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = new Set()));
    }
    dep.add(activeEffect);
  }
}

function trigger(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  let dep = depsMap.get(key);
  if (dep) {
    dep.forEach((effect) => {
      effect();
    });
  }
}

function effect(eff) {
  activeEffect = eff;
  activeEffect();
  activeEffect = null;
}

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, key);
      }
      return result;
    },
  };
  return new Proxy(target, handler);
}

function ref(raw) {
  let r = {
    get value() {
      track(r, "value");
      return raw;
    },

    set value(newVal) {
      raw = newVal;
      trigger(r, "value");
    },
  };
  return r;
}

effect(() => {
  let { quantity, price } = product;
  total = price * quantity;
});

effect(() => {
  let { price } = product;
  salePrice.value = price * 0.9;
});

console.log(total);

product.price = 20;

console.log(total);
// product.quantity = 4;
