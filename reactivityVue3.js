let price = 5;
let quantity = 23;
let total = 0;

let dep = new Set();

let effect = function () {
  total = price * quantity;
};

function track() {
  dep.add(effect);
}

function trigger() {
  dep.forEach((effect) => effect());
}
track();
trigger();
