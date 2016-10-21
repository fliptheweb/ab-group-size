'use strict'

let ABGroupSize = require('../src/index');

let initData = {
  alpha: 5,  // optional
  beta: 20,  // optional
  convertion: [1.2, 1.4],
  // conversionRates: [1.2, 1.4], // refactor
  currentGroupSizes: [], // optional
  deltaСonversion: 5   // optional
  // maxTrafficPerGroup: 10000
}

const RESULTS = {
  WINNER_FIRST: 'First variant are winner.',
  WINNER_SECOND: 'Second variant are winner.',
  WINNER_EQUAL: 'Both variants are equal.',
  NOT_ENOUGH: (strings) =>
    `It\`s not enough traffic in groups, need ${strings}.`,
  NO_CURRENT_GROUP: 'We can`t detect winner, because it`s relative to the group size.',
  NOT_MINIMUM_DELTA_CONVERSION: (deltaСonversion, currentDeltaConversion) =>
    `Waiting for minimum delta between conversion (${deltaСonversion}). Current – ${currentDeltaConversion}. Now both variants are equal.`
}

let getTextOfResult = (resultCode, ...params) => {
  if (!RESULTS[resultCode]) return;

  if (typeof (RESULTS[resultCode]) === 'function') {
    return RESULTS[resultCode](...params);
  } else {
    return RESULTS[resultCode];
  }
}

let validateData = ({alpha, beta, convertion, convertionRate, currentGroupSizes, deltaСonversion}) => {
  if (!convertion || convertion.length !== 2) {
    try {
      throw new Error('You must pass 2 convertion value, like [3, 3.2].');
    } catch (err) {
      return err;
    }
  }

  let validatedData = {
    alpha: parseFloat(alpha),
    beta: parseFloat(beta),
    convertion: [parseFloat(convertion[0]), parseFloat(convertion[1])],
    convertionRate: [parseFloat(convertionRate[0]), parseFloat(convertionRate[1])]
  }

  if (currentGroupSizes && currentGroupSizes.length === 2) {
    validatedData.currentGroupSizes = [parseFloat(currentGroupSizes[0]), parseFloat(currentGroupSizes[1])];

    if ((currentGroupSizes[0] <= validatedData.convertion[0]) ||
      (currentGroupSizes[1] <= validatedData.convertion[1])) {
      try {
        throw new Error('Conversion can`t be more than group size');
      } catch (err) {
        return err;
      }
    }
  }

  if (deltaСonversion) {
    validatedData.deltaСonversion = parseFloat(deltaСonversion);
  }

  return validatedData;
}

let ABGroupSizeGui = (params) => {
  let data = validateData(params);
  let result = {};
  // validate data
  console.log('gui data', data)
  console.log('gui params', params)
  result.groupSizes = ABGroupSize(data);
  result.winner = false;

  // Сравниваем с текущими размерами групп
  // Сравниваем с дельтой если есть
  if (!data.currentGroupSizes || data.currentGroupSizes.length !== 2) {
    result.text = getTextOfResult('NO_CURRENT_GROUP');
  }

  if (data.currentGroupSizes && data.currentGroupSizes.length === 2) {
    let isEnoughData = false;

    if (data.currentGroupSizes[0] >= result.groupSizes[0] && data.currentGroupSizes[1] >= result.groupSizes[1]) {
      isEnoughData = true
    }

    // Определяем победителя
    if (isEnoughData) {
      if (data.convertion[0] > data.convertion[1]) {
        result.winner = 1;
        result.text = getTextOfResult('WINNER_FIRST');
      } else if (data.convertion[0] < data.convertion[1]) {
        result.winner = 2;
        result.text = getTextOfResult('WINNER_SECOND');
      } else {
        result.winner = [1, 2];
        result.text = getTextOfResult('WINNER_EQUAL');
      }
    }

    if (!isEnoughData) {
      let missingAmount;
      if (result.groupSizes[0] === result.groupSizes[1]) {
        missingAmount = `${result.groupSizes[0] - data.currentGroupSizes[0]} more per both groups`;
      } else {
        missingAmount = `${result.groupSizes[0] - data.currentGroupSizes[0]} in first and ${result.groupSizes[0] - data.currentGroupSizes[0]} in second group`;
      }
      result.text = getTextOfResult('NOT_ENOUGH', missingAmount);
    }

    // Delta Conversions – насколько % различаются конверсии
    let currentDeltaConversion = Math.abs(100 - (data.convertion[1] / (data.convertion[0] / 100)));
    // Если текущая разница конверсий меньше, чем нужно, то победителя нет
    if (data.deltaСonversion && data.deltaСonversion > currentDeltaConversion) {
      // result.deltaGroupSizes = ABGroupSize(Object.assign(
      //   {},
      //   data,
      //   {
      //     convertionRate: [
      //       ABGroupSize().convertionToConvertionRate(params.currentGroupSizes[0], data.convertion[0]),
      //       ABGroupSize().convertionToConvertionRate(params.currentGroupSizes[1], data.convertion[0] + (data.convertion[0] / 100 * data.deltaСonversion))
      //     ]
      //   }
      // ));
      result.winner = false;
      result.text = getTextOfResult('NOT_MINIMUM_DELTA_CONVERSION', data.deltaСonversion, currentDeltaConversion);

      // if (data.currentGroupSizes[0] >= result.deltaGroupSizes[0] && data.currentGroupSizes[1] >= result.deltaGroupSizes[1]) {
      //   result.text = 'It`s enough traffic for your delta convertion';
      //   result.type = 'ENOUGH_TRAFFIC_DELTA';
      // }
    }
  }

  return Object.assign(
    {},
    {initData: data},
    result
  )
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
let maxTraffic = document.getElementById('max-traffic');

// Result
let result = document.getElementById('result');
let resultMessage = document.querySelector('.ab-calculator__result-message');

let renderCalculator = (event) => {
  let convertion = [
    aConversion.value,
    bConversion.value
  ];
  let convertionRate = [
    ABGroupSize().convertionToConvertionRate(aGroupSize.value, aConversion.value),
    ABGroupSize().convertionToConvertionRate(bGroupSize.value, bConversion.value)
  ]
  aConversionRate.innerHTML = convertionRate[0] + '%';
  bConversionRate.innerHTML = convertionRate[1] + '%';

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
      convertionRate: convertionRate,
      maxTrafficPerGroup: maxTraffic.value,
      deltaСonversion: deltaСonversion.value
    }
  )
  data = ABGroupSizeGui(data);

  resultMessage.innerHTML = data.text;
  result.innerHTML = JSON.stringify(data, null, 2);
}

// Bind render to all controls
[alpha, beta, deltaСonversion, maxTraffic, aGroupSize, bGroupSize, aConversion, bConversion].forEach((control) => {
  ['change', 'click', 'keyup'].forEach((eventName) => {
    control.addEventListener(eventName, renderCalculator);
  })
})

// Initial
renderCalculator();
