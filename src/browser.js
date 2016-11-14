'use strict'
require('./styles.css');
let template = require('./template.html');
let ABGroupSize = require('../src/index');
let initialized = false;
let DEFAULT_DATA = {
  alpha: 5,
  beta: 20,
  deltaConversion: 5
}

let container = document.getElementById('ab-calculator');
container.innerHTML = template;

// Format result
let aGroupSizeField = container.querySelector('#a-group-size');
let bGroupSizeField = container.querySelector('#b-group-size');
let aConversionField = container.querySelector('#a-conversion');
let bConversionField = container.querySelector('#b-conversion');
let aConversionRateField = container.querySelector('#a-conversion-rate');
let bConversionRateField = container.querySelector('#b-conversion-rate');

// Settings
let alphaField = container.querySelector('#alpha');
let betaField = container.querySelector('#beta');
let neededDeltaConversionField = container.querySelector('#needed-delta-conversion');
let settingsButton = container.querySelector('#settings-button');

// Result
let resultMessage = container.querySelector('.ab-calculator__result-message');
let minimumGroupSize = container.querySelector('.ab-calculator__needed-group-size');
let deltaConversionField = container.querySelector('.ab-calculator__delta-conversion');

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
  if (!initialized) {
    initialized = true;
    data = Object.assign(
      {},
      DEFAULT_DATA,
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

  container.classList.remove('is-winner-a', 'is-winner-b');
  if (!(data instanceof Error)) {
    if (data.conversionRate) {
      aConversionRateField.innerHTML = data.conversionRate[0] + '%';
      bConversionRateField.innerHTML = data.conversionRate[1] + '%';
    }
    if (data.winner) {
      container.classList.add(data.winner === 1 ? 'is-winner-a' : 'is-winner-b');
    }
    deltaConversionField.innerHTML = `Δ ${data.deltaConversion.toFixed(2).toLocaleString()}`;
    minimumGroupSize.innerText = `min ${Math.max(...data.neededGroupSize).toLocaleString()}`;
    resultMessage.innerHTML = data.text.join('<br/>');
  } else {
    deltaConversionField.innerHTML = '';
    minimumGroupSize.innerText = '';
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
