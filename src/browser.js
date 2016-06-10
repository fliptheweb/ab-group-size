'use strict'

let ABGroupSize = require('../');

let initData = {
  alpha: 5,
  beta: 20,
  convertions: ['', ''],
  currentGroupSizes: [],
  deltaConvertion: '',
  maxTrafficPerGroup: 10000
}

let ABGroupSizeGui = function (data) {
  // validate data
  let groupSizes = ABGroupSize(data);
  if (data.deltaConvertion) {
    let groupSizesDelta = ABGroupSize({
      ...data,
      convertions: [
        data.convertions[0],
        data.convertions[0] + (data.convertions[0] / 100 * data.deltaConvertion)
      ]
    });
  }

  // Сравниваем с текущими размерами групп
  // Сравниваем с дельтой если есть
  //
}

ABGroupSizeGui(initData);
