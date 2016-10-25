'use strict'

let ABGroupSize = require('../src/index');

let initData = {
  alpha: 5,  // optional
  beta: 20,  // optional
  convertion: [100, 100],
  // conversionRates: [1.2, 1.4], // refactor
  currentGroupSizes: [],
  deltaСonversion: 5   // optional
  // maxTrafficPerGroup: 10000
}

//
// Format result
//

let aGroupSize = document.getElementById('a-group-size');
let bGroupSize = document.getElementById('b-group-size');
let aConversion = document.getElementById('a-conversion');
let bConversion = document.getElementById('b-conversion');
let aConversionRate = document.getElementById('a-conversion-rate');
let bConversionRate = document.getElementById('b-conversion-rate');

// Settings
let alpha = document.getElementById('alpha');
let beta = document.getElementById('beta');
let deltaСonversion = document.getElementById('delta-conversion');

// Result
let result = document.getElementById('result');
let resultMessage = document.querySelector('.ab-calculator__result-message');

let renderCalculator = (event) => {
  let convertion = [
    aConversion.value,
    bConversion.value
  ];

  let data = Object.assign(
    {},
    initData,
    {
      alpha: alpha.value,
      beta: beta.value,
      currentGroupSizes: [
        aGroupSize.value,
        bGroupSize.value
      ],
      convertion: convertion,
      deltaСonversion: deltaСonversion.value
    }
  )
  data = ABGroupSize(data);

  if (!(data instanceof Error)) {
    if (data.convertionRate) {
      aConversionRate.innerHTML = data.convertionRate[0] + '%';
      bConversionRate.innerHTML = data.convertionRate[1] + '%';
    }
    resultMessage.innerHTML = data.text;
    result.innerHTML = JSON.stringify(data, null, 2);
  } else {
    resultMessage.innerHTML = 'Errors: ' + data.message;
  }
}

// Bind render to all controls
[alpha, beta, deltaСonversion, aGroupSize, bGroupSize, aConversion, bConversion].forEach((control) => {
  ['change', 'click', 'keyup'].forEach((eventName) => {
    control.addEventListener(eventName, renderCalculator);
  })
})

// Initial
renderCalculator();
