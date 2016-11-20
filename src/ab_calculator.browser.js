'use strict'
require('./styles.css');
let template = require('./template.html');
let ABCalculator = require('./ab_calculator');
let isDom = require('is-dom');
let initialized = false;
let DEFAULT_DATA = {
  alpha: 5,
  beta: 20,
  deltaConversion: 5
}

module.exports = (element) => {
  if (!isDom(element)) {
    console.log('Given element isn`t DOM element')
    return;
  }

  element.innerHTML = template;

  // Format result
  let aGroupSizeField = element.querySelector('#a-group-size');
  let bGroupSizeField = element.querySelector('#b-group-size');
  let aConversionField = element.querySelector('#a-conversion');
  let bConversionField = element.querySelector('#b-conversion');
  let aConversionRateField = element.querySelector('#a-conversion-rate');
  let bConversionRateField = element.querySelector('#b-conversion-rate');

  // Settings
  let alphaField = element.querySelector('#alpha');
  let betaField = element.querySelector('#beta');
  let neededDeltaConversionField = element.querySelector('#needed-delta-conversion');
  let settingsButton = element.querySelector('#settings-button');

  // Result
  let resultMessage = element.querySelector('.ab-calculator__result-message');
  let minimumGroupSize = element.querySelector('.ab-calculator__needed-group-size');
  let deltaConversionField = element.querySelector('.ab-calculator__delta-conversion');

  let getSettingsFromAttrubutes = () => {
    let settings = {};
    let data = element.dataset;
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

  let getDeltaConversionText = (deltaConversion) => {
    return 'Δ ' + (isFinite(deltaConversion) ? parseFloat(deltaConversion.toFixed(2)) + '%' : '∞');
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
      console.log('You must pass conversion and groups size to ABCalculator plugin')
      return;
    }
    data = ABCalculator(data);

    element.classList.remove('is-winner-a', 'is-winner-b');
    if (!(data instanceof Error)) {
      if (data.conversionRate) {
        aConversionRateField.innerHTML = data.conversionRate[0] + '%';
        bConversionRateField.innerHTML = data.conversionRate[1] + '%';
      }
      if (data.winner) {
        element.classList.add(data.winner === 1 ? 'is-winner-a' : 'is-winner-b');
      }
      deltaConversionField.innerHTML = getDeltaConversionText(data.deltaConversion)
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
  settingsButton.addEventListener('click', () => element.classList.toggle('is-settings-opened'))

  // Initial
  renderCalculator();
}
