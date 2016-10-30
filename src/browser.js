'use strict'

let ABGroupSize = require('../src/index');
let initiated = false;
let defaultData = {
  alpha: 5,  // optional
  beta: 20,  // optional
  conversion: [100, 100],
  // conversionRates: [1.2, 1.4], // refactor
  currentGroupSize: [],
  deltaConversion: 5   // optional
  // maxTrafficPerGroup: 10000
}

//
// Format result
//
let container = document.querySelector('.ab-calculator');
let aGroupSizeField = document.getElementById('a-group-size');
let bGroupSizeField = document.getElementById('b-group-size');
let aConversionField = document.getElementById('a-conversion');
let bConversionField = document.getElementById('b-conversion');
let aConversionRateField = document.getElementById('a-conversion-rate');
let bConversionRateField = document.getElementById('b-conversion-rate');

// Settings
let alphaField = document.getElementById('alpha');
let betaField = document.getElementById('beta');
let deltaConversionField = document.getElementById('delta-conversion');

// Result
let result = document.getElementById('result');
let resultMessage = document.querySelector('.ab-calculator__result-message');

let getSettingsFromAttrubutes = () => {
  let settings = {};
  let data = container.dataset;
  let conversion = data.abcalculatorConversion;
  let currentGroupSize = data.abcalculatorCurrentGroupSize;
  if (conversion) {
    try {
      settings.conversion = JSON.parse(conversion);
    } catch (e) {
      console.warn(`Can't parse conversion from data attribute. ${e.message}`);
    }
  }
  if (currentGroupSize) {
    try {
      settings.currentGroupSize = JSON.parse(currentGroupSize);
    } catch (e) {
      console.warn(`Can't parse current group size from data attribute. ${e.message}`);
    }
  }
  if (data.abcalculatorAlpha) { settings.alpha = data.abcalculatorAlpha }
  if (data.abcalculatorBeta) { settings.beta = data.abcalculatorBeta }
  if (data.abcalculatorDeltaConversion) { settings.deltaConversion = data.abcalculatorDeltaConversion }
  return settings;
}

let getSettingsFromFields = () => {
  return {
    alpha: alphaField.value,
    beta: betaField.value,
    currentGroupSize: [
      aGroupSizeField.value,
      bGroupSizeField.value
    ],
    conversion: [
      aConversionField.value,
      bConversionField.value
    ],
    deltaConversion: deltaConversionField.value
  }
}

let fillFieldFromSettings = ({alpha, beta, currentGroupSize, conversion, deltaConversion}) => {
  if (alpha) { alphaField.value = alpha }
  if (beta) { betaField.value = beta }
  if (deltaConversion) { deltaConversionField.value = deltaConversion }
  if (currentGroupSize) {
    aGroupSizeField.value = currentGroupSize[0];
    bGroupSizeField.value = currentGroupSize[1];
  }
  if (conversion) {
    aConversionField.value = conversion[0];
    bConversionField.value = conversion[1];
  }
}

let renderCalculator = (event) => {
  if (!initiated) {
    fillFieldFromSettings(getSettingsFromAttrubutes())
    initiated = true;
  }
  let data = Object.assign(
    {},
    defaultData,
    getSettingsFromFields()
  )
  data = ABGroupSize(data);

  if (!(data instanceof Error)) {
    if (data.conversionRate) {
      aConversionRateField.innerHTML = data.conversionRate[0] + '%';
      bConversionRateField.innerHTML = data.conversionRate[1] + '%';
    }
    resultMessage.innerHTML = data.text.join('<br/>');
    result.innerHTML = JSON.stringify(data, null, 2);
  } else {
    resultMessage.innerHTML = 'Errors: ' + data.message;
  }
}

// Bind render to all controls
[
  alphaField, betaField, deltaConversionField, aGroupSizeField, bGroupSizeField,
  aConversionField, bConversionField
].forEach((control) => {
  ['change', 'click', 'keyup'].forEach((eventName) => {
    control.addEventListener(eventName, renderCalculator);
  })
})

// Initial
renderCalculator();
