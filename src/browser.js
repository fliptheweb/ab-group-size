'use strict'

let ABGroupSize = require('../src/index');

let initData = {
  alpha: 5,  // optional
  beta: 20,  // optional
  conversion: [100, 100],
  // conversionRates: [1.2, 1.4], // refactor
  currentGroupSizes: [],
  deltaСonversion: 5   // optional
  // maxTrafficPerGroup: 10000
}

//
// Format result
//

let container = document.querySelector('.ab-calculator');
let aGroupSize = document.getElementById('a-group-size');
let bGroupSize = document.getElementById('b-group-size');
let aconversion = document.getElementById('a-conversion');
let bconversion = document.getElementById('b-conversion');
let aconversionRate = document.getElementById('a-conversion-rate');
let bconversionRate = document.getElementById('b-conversion-rate');

// Settings
let alpha = document.getElementById('alpha');
let beta = document.getElementById('beta');
let deltaСonversion = document.getElementById('delta-conversion');

// Result
let result = document.getElementById('result');
let resultMessage = document.querySelector('.ab-calculator__result-message');

let getSettingsFromAttrubutes = () => {
  let data = container.dataset
  let conversion = data.abcalculatorConversion
  let currentGroupSize = data.abcalculatorCurrentGroupSize
  if (conversion) {
    try {
      conversion = JSON.parse(conversion);
    } catch (e) {
      console.warn(`Can't parse conversion from data attribute. ${e.message}`)
    }
  }
  if (currentGroupSize) {
    try {
      currentGroupSize = JSON.parse(currentGroupSize);
    } catch (e) {
      console.warn(`Can't parse current group size from data attribute. ${e.message}`)
    }
  }

  return {
    alpha: data.abcalculatorAlpha,
    beta: data.abcalculatorBeta,
    deltaConversion: data.abcalculatorDeltaConversion,
    conversion,
    currentGroupSize
  }
}

let getSettingsFromFields = () => {
  return {
    alpha: alpha.value,
    beta: beta.value,
    currentGroupSizes: [
      aGroupSize.value,
      bGroupSize.value
    ],
    conversion: [
      aconversion.value,
      bconversion.value
    ],
    deltaСonversion: deltaСonversion.value
  }
}

let renderCalculator = (event) => {
  let data = Object.assign(
    {},
    initData,
    getSettingsFromFields(),
    getSettingsFromAttrubutes()
  )
  data = ABGroupSize(data);

  if (!(data instanceof Error)) {
    if (data.conversionRate) {
      aconversionRate.innerHTML = data.conversionRate[0] + '%';
      bconversionRate.innerHTML = data.conversionRate[1] + '%';
    }
    resultMessage.innerHTML = data.text.join('<br/>');
    result.innerHTML = JSON.stringify(data, null, 2);
  } else {
    resultMessage.innerHTML = 'Errors: ' + data.message;
  }
}

// Bind render to all controls
[alpha, beta, deltaСonversion, aGroupSize, bGroupSize, aconversion, bconversion].forEach((control) => {
  ['change', 'click', 'keyup'].forEach((eventName) => {
    control.addEventListener(eventName, renderCalculator);
  })
})

// Initial
renderCalculator();
