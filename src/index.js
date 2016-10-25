'use strict'

const Z_MAX = 6; // Maximum z value
const DEFAULT_ALPHA = 5;
const DEFAULT_BETA = 20;
const DEFAULT_RATIO = 1;
const CONVERSION_ACCURACY = 2;
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

let ABGroupSize = {
  constructor: (params) => {
    let data = ABGroupSize._validateParams(params);

    if (data.errors) {
      let errorsText = data.errors.reduce((result, error) => {
        console.warn(error);
        result += error + '\n';
        return result;
      }, '')
      return new Error(errorsText);
    }

    let result = {
      groupSizes: ABGroupSize.getGroupSize(data),
      winner: false,
      text: []
    };

    // Сравниваем с текущими размерами групп
    // Сравниваем с дельтой если есть
    if (!data.currentGroupSizes || data.currentGroupSizes.length !== 2) {
      result.text.push(getTextOfResult('NO_CURRENT_GROUP'));
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
          result.text.push(getTextOfResult('WINNER_FIRST'));
        } else if (data.convertion[0] < data.convertion[1]) {
          result.winner = 2;
          result.text.push(getTextOfResult('WINNER_SECOND'));
        } else {
          result.winner = [1, 2];
          result.text.push(getTextOfResult('WINNER_EQUAL'));
        }
      }

      if (!isEnoughData) {
        let missingAmount;
        if (result.groupSizes[0] === result.groupSizes[1]) {
          missingAmount = `${result.groupSizes[0] - data.currentGroupSizes[0]} more per both groups`;
        } else {
          missingAmount = `${result.groupSizes[0] - data.currentGroupSizes[0]} in first and ${result.groupSizes[0] - data.currentGroupSizes[0]} in second group`;
        }
        result.text.push(getTextOfResult('NOT_ENOUGH', missingAmount));
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
        result.text.push(getTextOfResult('NOT_MINIMUM_DELTA_CONVERSION', data.deltaСonversion, currentDeltaConversion));

        // if (data.currentGroupSizes[0] >= result.deltaGroupSizes[0] && data.currentGroupSizes[1] >= result.deltaGroupSizes[1]) {
        //   result.text = 'It`s enough traffic for your delta convertion';
        //   result.type = 'ENOUGH_TRAFFIC_DELTA';
        // }
      }
    }

    return Object.assign(
      {},
      data,
      result
    )
  },

  /*
    Calculation formula from http://clincalc.com/Stats/SampleSize.aspx
    conversion1 (p1), conversion2 (p2) = proportion (incidence) of groups #1 and #2
    delta, Δ = |p2-p1| = absolute difference between two proportions
    α = probability of type I error (usually 0.05)
    β = probability of type II error (usually 0.2)
    z = critical Z value for a given α or β
    ratio, K = ratio of sample size for group #2 to group #1
    n1 = sample size for group #1
    n2 = sample size for group #2
  */
  getGroupSize: (data) => {
    let {alpha, beta, convertionRate, ratio} = ABGroupSize._validateParams(data);
    alpha = alpha / 100;
    beta = beta / 100;
    convertionRate = [convertionRate[0] / 100, convertionRate[1] / 100];

    let delta = Math.abs(convertionRate[0] - convertionRate[1]);
    let q1 = 1 - convertionRate[0];
    let q2 = 1 - convertionRate[1];
    let pResult = (convertionRate[0] + ratio * convertionRate[1]) / (1 + ratio);
    let qResult = 1 - pResult;
    let zValue1 = ABGroupSize._computeCriticalNormalZValue(1 - alpha / 2);
    let zValue2 = ABGroupSize._computeCriticalNormalZValue(1 - beta);

    let groupSize1 = Math.pow(
      (zValue1 * Math.sqrt(
        pResult * qResult * (1 + 1 / ratio)
      ) + zValue2 * Math.sqrt(
        convertionRate[0] * q1 + ((convertionRate[1] * q2) / ratio))
      )
    , 2) / Math.pow(delta, 2);
    let groupSize2 = ratio * groupSize1;

    return [
      parseInt(Math.round(groupSize1), 10),
      parseInt(Math.round(groupSize2), 10)
    ];
  },

  _convertionToConvertionRate: (sizeOfGroup, conversion) => {
    return (parseInt(conversion) / (parseInt(sizeOfGroup) / 100)).toFixed(CONVERSION_ACCURACY);
  },

  _validateParams: ({alpha = DEFAULT_ALPHA, beta = DEFAULT_BETA, convertion, currentGroupSizes, ratio = DEFAULT_RATIO}) => {
    let result = {};
    let errors = [];
    let isCurrentGroupSizesValid =
      currentGroupSizes.length === 2 && currentGroupSizes[0] !== '' && currentGroupSizes[1] !== '' && !isNaN(currentGroupSizes[0]) && !isNaN(currentGroupSizes[1]);
    let isConvertionValid =
      convertion.length === 2 && convertion[0] !== '' && convertion[1] !== '' && !isNaN(convertion[0]) && !isNaN(convertion[1]);
    alpha = parseFloat(alpha);
    beta = parseFloat(beta);
    ratio = parseFloat(ratio);

    if (isConvertionValid) {
      convertion = [parseFloat(convertion[0]), parseFloat(convertion[1])];
    } else {
      if (convertion.length !== 2) {
        errors.push('You must pass 2 convertion value, like [3, 3.2].')
      }
      errors.push('You must pass valid convertion values.')
    }
    if (currentGroupSizes) {
      if (isCurrentGroupSizesValid) {
        currentGroupSizes = [parseInt(currentGroupSizes[0]), parseInt(currentGroupSizes[1])];
      } else {
        errors.push('You must pass 2 currentGroupSizes.')
      }
    } else {
      errors.push('You must pass currentGroupSizes.')
    }
    if (alpha < 0 || alpha > 100 || isNaN(alpha)) {
      errors.push(`Alpha must be from 0 to 100 percent. Alpha set to defaul ${DEFAULT_ALPHA}.`);
      alpha = DEFAULT_ALPHA;
    }
    if (beta < 0 || beta > 100 || isNaN(beta)) {
      errors.push(`Beta must be from 0 to 100 percent. Beta set to default ${DEFAULT_BETA}.`);
      beta = DEFAULT_BETA;
    }
    if (isNaN(ratio) && ratio !== 2) {
      errors.push('Ratio temporarily must be only 2.');
      ratio = DEFAULT_RATIO;
    }

    result = {
      convertion,
      currentGroupSizes,
      ratio,
      alpha,
      beta
    }

    if (isConvertionValid && isCurrentGroupSizesValid) {
      if (convertion[0] >= currentGroupSizes[0] || convertion[1] >= currentGroupSizes[1]) {
        errors.push('Convertion can`t be more than group size');
      }

      result.convertionRate = [
        parseFloat(ABGroupSize._convertionToConvertionRate(currentGroupSizes[0], convertion[0])),
        parseFloat(ABGroupSize._convertionToConvertionRate(currentGroupSizes[1], convertion[1]))
      ]
    }

    if (errors.length) {
      result.errors = errors;
    }

    return result;
  },

  // @todo in future get implementation from http://jstat.github.io/test.html ?
  // Next Z-value compute formulas from http://sampson.byu.edu/courses/z2p2z-calculator.html
  /*  The following JavaScript functions for calculating normal and
      chi-square probabilities and critical values were adapted by
      John Walker from C implementations
      written by Gary Perlman of Wang Institute, Tyngsboro, MA
      01879.  Both the original C code and this JavaScript edition
      are in the public domain.  */
  /*
    Compute critical normal z value to
    produce given p. We just do a bisection
    search for a value within CHI_EPSILON,
    relying on the monotonicity of pochisq().
  */
  _computeCriticalNormalZValue: (probability) => {
    const Z_EPSILON = 0.000001; // Accuracy of z approximation
    let minz = -Z_MAX;
    let maxz = Z_MAX;
    let zval = 0.0;
    let pval;

    if (probability < 0.0 || probability > 1.0) {
      return -1;
    }

    while ((maxz - minz) > Z_EPSILON) {
      pval = ABGroupSize._probabilityOfNormalZValue(zval);
      if (pval > probability) {
        maxz = zval;
      } else {
        minz = zval;
      }
      zval = (maxz + minz) * 0.5;
    }

    return zval;
  },

  /*  Probability of normal Z-value
      Adapted from a polynomial approximation in:
              Ibbetson D, Algorithm 209
              Collected Algorithms of the CACM 1963 p. 616
      Note:
              This routine has six digit accuracy, so it is only useful for absolute
              z values <= 6.  For z values > to 6.0, poz() returns 0.0.
  */
  _probabilityOfNormalZValue: (z) => {
    var y, x, w;

    if (z === 0.0) {
      x = 0.0;
    } else {
      y = 0.5 * Math.abs(z);
      if (y > (Z_MAX * 0.5)) {
        x = 1.0;
      } else if (y < 1.0) {
        w = y * y;
        x = ((((((((0.000124818987 * w -
                   0.001075204047) * w + 0.005198775019) * w -
                   0.019198292004) * w + 0.059054035642) * w -
                   0.151968751364) * w + 0.319152932694) * w -
                   0.531923007300) * w + 0.797884560593) * y * 2.0;
      } else {
        y -= 2.0;
        x = (((((((((((((-0.000045255659 * y +
                         0.000152529290) * y - 0.000019538132) * y -
                         0.000676904986) * y + 0.001390604284) * y -
                         0.000794620820) * y - 0.002034254874) * y +
                         0.006549791214) * y - 0.010557625006) * y +
                         0.011630447319) * y - 0.009279453341) * y +
                         0.005353579108) * y - 0.002141268741) * y +
                         0.000535310849) * y + 0.999936657524;
      }
    }

    return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
  }
}

module.exports = (data) => {
  if (data) {
    return ABGroupSize.constructor(data);
  } else {
    return ABGroupSize;
  }
}
