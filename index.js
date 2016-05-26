"use strict";

let ab_calculator = require('./src/main.js');

let initData = {
  alpha: 0.05,
  beta: 0.2,
  convertion1: 3 / 100,
  convertion2: 3.2 / 100, // or delta_convertion: 5
  ratio: 1,
  trafficMax: 500000
};

console.log(ab_calculator.sampleSize(initData));
