'use strict'
require('./styles.css');
let ABGroupSize = require('../src/index');
let initiated = false;
let defaultData = {
  alpha: 5,
  beta: 20,
  deltaConversion: 5
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
let deltaConversionField = document.getElementById('delta-conversion');

// Settings
let alphaField = document.getElementById('alpha');
let betaField = document.getElementById('beta');
let neededDeltaConversionField = document.getElementById('needed-delta-conversion');
let settingsButton = document.getElementById('settings-button');

// Result
let resultMessage = document.querySelector('.ab-calculator__result-message');

let getSettingsFromAttrubutes = () => {
  let settings = {};
  let data = container.dataset;
  let conversion = data.abcalculatorConversion;
  let groupSize = data.abcalculatorGroupSize;
  if (conversion) {
    try {
      settings.conversion = JSON.parse(conversion);
    } catch (e) {
      console.warn(`Can't parse conversion from data attribute. ${e.message}`);
    }
  }
  if (groupSize) {
    try {
      settings.groupSize = JSON.parse(groupSize);
    } catch (e) {
      console.warn(`Can't parse current group size from data attribute. ${e.message}`);
    }
  }
  if (data.abcalculatorAlpha) { settings.alpha = data.abcalculatorAlpha }
  if (data.abcalculatorBeta) { settings.beta = data.abcalculatorBeta }
  if (data.abcalculatorNeededDeltaConversion) { settings.neededDeltaConversion = data.abcalculatorNeededDeltaConversion }
  return settings;
}

let getSettingsFromFields = () => {
  let result = {}
  if (alphaField.value !== '') {
    result.alpha = alphaField.value;
  }
  if (betaField.value !== '') {
    result.beta = betaField.value;
  }
  if (aGroupSizeField.value !== '' && bGroupSizeField.value !== '') {
    result.groupSize = [
      aGroupSizeField.value,
      bGroupSizeField.value
    ];
  }
  if (aConversionField.value !== '' && bConversionField.value !== '') {
    result.conversion = [
      aConversionField.value,
      bConversionField.value
    ];
  }
  if (neededDeltaConversionField.value !== '') {
    result.neededDeltaConversion = neededDeltaConversionField.value;
  }

  return result;
}

let fillFieldFromSettings = ({alpha, beta, groupSize, conversion, neededDeltaConversion}) => {
  if (alpha) { alphaField.value = alpha }
  if (beta) { betaField.value = beta }
  if (neededDeltaConversion) { neededDeltaConversionField.value = neededDeltaConversion }
  if (groupSize) {
    aGroupSizeField.value = groupSize[0];
    bGroupSizeField.value = groupSize[1];
  }
  if (conversion) {
    aConversionField.value = conversion[0];
    bConversionField.value = conversion[1];
  }
}

let renderCalculator = (settingFromParams) => {
  let data = {}
  if (!initiated) {
    initiated = true;
    data = Object.assign(
      {},
      defaultData,
      getSettingsFromAttrubutes()
    );
    fillFieldFromSettings(data);
  } else {
    data = getSettingsFromFields();
  }
  if (!data.conversion || !data.groupSize) {
    console.log('You must pass conversion and groups size to ABGroupSize plugin')
    return;
  }
  data = ABGroupSize(data);

  if (!(data instanceof Error)) {
    container.classList.remove('is-winner-a', 'is-winner-b');
    if (data.conversionRate) {
      aConversionRateField.innerHTML = data.conversionRate[0] + '%';
      bConversionRateField.innerHTML = data.conversionRate[1] + '%';
    }
    if (data.winner) {
      container.classList.add(data.winner === 1 ? 'is-winner-a' : 'is-winner-b');
    }
    deltaConversionField.innerHTML = isFinite(data.deltaConversion) ? data.deltaConversion.toFixed(2) + '%' : '∞';
    resultMessage.innerHTML = data.text.join('<br/>');
    // result.innerHTML = JSON.stringify(data, null, 2);
  } else {
    resultMessage.innerHTML = 'Errors: ' + data.message;
  }
}

// Bind render to all controls
[
  alphaField, betaField, neededDeltaConversionField, aGroupSizeField, bGroupSizeField,
  aConversionField, bConversionField
].forEach((control) => {
  ['change', 'click', 'keyup'].forEach((eventName) => {
    control.addEventListener(eventName, renderCalculator);
  })
})

settingsButton.addEventListener('click', () => container.classList.toggle('is-settings-opened'))

// Initial
renderCalculator();
