'use strict'

let ABGroupSize = require('../src/index');

let initData = {
  alpha: 5,  // optional
  beta: 20,  // optional
  convertions: [1.2, 1.4],
  currentGroupSizes: [], // optional
  deltaConvertion: 5   // optional
  // maxTrafficPerGroup: 10000
}

const RESULTS = {
  WINNER_FIRST: 'First variant are winner.',
  WINNER_SECOND: 'Second variant are winner.',
  WINNER_EQUAL: 'Both variants are equal.',
  NOT_ENOUGH: (strings) =>
    `It\`s not enough traffic in groups, need ${strings[0]}.`,
  NO_CURRENT_GROUP: 'We can`t detect winner, because it`s relative to the group size.',
  NOT_MINIMUM_DELTA_CONVERTION: ([deltaConvertion, currentDeltaConversion]) =>
    `Waiting for minimum delta between conversion (${deltaConvertion}). Current – ${currentDeltaConversion}`
}

let getTextOfResult = (resultCode, ...params) => {
  if (!RESULTS[resultCode]) return;

  if (typeof (RESULTS[resultCode]) === 'function') {
    return RESULTS[resultCode](params);
  } else {
    return RESULTS[resultCode];
  }
}

let validateData = ({alpha, beta, convertions, currentGroupSizes, deltaConvertion}) => {
  if (!convertions || convertions.length !== 2) {
    try {
      throw new Error('You must pass 2 convertions value, like [3, 3.2].');
    } catch (err) {
      return err;
    }
  }

  let validatedData = {
    alpha: parseFloat(alpha),
    beta: parseFloat(beta),
    convertions: [parseFloat(convertions[0]), parseFloat(convertions[1])]
  }

  if (currentGroupSizes && currentGroupSizes.length === 2) {
    validatedData.currentGroupSizes = [parseFloat(currentGroupSizes[0]), parseFloat(currentGroupSizes[1])];
  }

  if (deltaConvertion) {
    validatedData.deltaConvertion = parseFloat(deltaConvertion);
  }

  return validatedData;
}

let ABGroupSizeGui = (params) => {
  let data = validateData(params);
  let result = {};
  // определиться как мерить delta, в процентах между конверсиями?
  let currentDeltaConversion = Math.abs(data.convertions[0] - data.convertions[1]);

  // validate data
  result.groupSizes = ABGroupSize(data);
  result.winner = false;

  if (data.deltaConvertion) {
    result.deltaGroupSizes = ABGroupSize(Object.assign(
      {},
      data,
      {
        convertions: [
          data.convertions[0],
          data.convertions[0] + (data.convertions[0] / 100 * data.deltaConvertion)
        ]
      }
    ));
  }

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
      if (data.convertions[0] > data.conversions[1]) {
        result.winner = 1;
        result.text = getTextOfResult('WINNER_FIRST');
      } else if (data.convertions[0] < data.conversions[1]) {
        result.winner = 2;
        result.text = getTextOfResult('WINNER_SECOND');
      } else {
        result.winner = [1, 2];
        result.text = getTextOfResult('WINNER_EQUAL');
      }
    }

    if (!isEnoughData) {
      let missingAmount = '';
      if (result.groupSizes[0] === result.groupSizes[1]) {
        missingAmount = `${result.groupSizes[0] - data.currentGroupSizes[0]} more in both groups`;
      } else {
        missingAmount = `${result.groupSizes[0] - data.currentGroupSizes[0]} in first and ${result.groupSizes[0] - data.currentGroupSizes[0]} in second group`;
      }
      result.text = getTextOfResult('NOT_ENOUGH', missingAmount);
    }

    // Если текущая разница конверсий больше, чем нужно, то победитель есть, если нет, то нет
    if (data.deltaConvertion && data.deltaConvertion > currentDeltaConversion) {
      result.winner = false;
      result.text = getTextOfResult('NOT_MINIMUM_DELTA_CONVERTION', data.deltaConvertion, currentDeltaConversion);

      // if (data.currentGroupSizes[0] >= result.deltaGroupSizes[0] && data.currentGroupSizes[1] >= result.deltaGroupSizes[1]) {
      //   result.text = 'It`s enough traffic for your delta convertions';
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

// Settings
let alpha = document.getElementById('alpha');
let beta = document.getElementById('beta');
let deltaConvertion = document.getElementById('delta-conversion');
let maxTraffic = document.getElementById('max-traffic');

let renderCalculator = (event) => {
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
      convertions: [
        1.2, 1.4
      ],
      maxTrafficPerGroup: maxTraffic.value,
      deltaConvertion: deltaConvertion.value
    }
  )
  document.getElementById('result').innerHTML = JSON.stringify(ABGroupSizeGui(data), null, 2);
}

[alpha, beta, deltaConvertion, maxTraffic].forEach((control) => {
  ['change', 'click', 'keyup'].forEach((eventName) => {
    control.addEventListener(eventName, renderCalculator);
  })
})

// Initial
renderCalculator()
