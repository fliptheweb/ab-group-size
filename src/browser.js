'use strict'

let ABGroupSize = require('../src/index');

let initData = {
  alpha: 5,  // optional
  beta: 20,  // optional
  convertions: ['', ''],
  currentGroupSizes: [], // optional
  deltaConvertion: ''   // optional
  // maxTrafficPerGroup: 10000
}

let validateData = function ({alpha, beta, convertions, currentGroupSizes, deltaConvertion}) {
  if (!convertions || convertions.length !== 2) {
    try {
      throw new Error('You must pass 2 convertions value, like [3, 3.2].');
    } catch (err) {
      return err;
    }
  }

  return {
    alpha: parseFloat(alpha),
    beta: parseFloat(beta),
    convertions: [parseFloat(convertions[0]), parseFloat(convertions[1])],
    currentGroupSizes: [parseFloat(currentGroupSizes[0]), parseFloat(currentGroupSizes[1])],
    deltaConvertion: parseFloat(deltaConvertion)
  }
}

let ABGroupSizeGui = function (params) {
  let data = validateData(params);
  // let isNeedMoreTraffic = false;
  let result = {};

  // validate data
  result.groupSizes = ABGroupSize(data);
  if (data.deltaConvertion) {
    result.groupSizesDelta = ABGroupSize({
      ...data,
      convertions: [
        data.convertions[0],
        data.convertions[0] + (data.convertions[0] / 100 * data.deltaConvertion)
      ]
    });
  }

  // Сравниваем с текущими размерами групп
  // Сравниваем с дельтой если есть
  if (data.currentGroupSizes) {
    if (data.currentGroupSizes[0] >= result.groupSizes[0] && data.currentGroupSizes[1] >= result.groupSizes[1]) {
      result.text = 'It`s enough traffic in groups';
    }

    if (data.currentGroupSizes[0] >= result.groupSizesDelta[0] && data.currentGroupSizes[1] >= result.groupSizesDelta[1]) {
      result.text = 'It`s enough traffic for your delta convertions';
    }
  }

  // Определяем победителя
  if (data.currentGroupSizes) {}

  //
}

ABGroupSizeGui(initData);
