'use strict'

const Z_MAX = 6; // Maximum z value
const DEFAULT_ALPHA = 5;
const DEFAULT_BETA = 20;
const DEFAULT_RATIO = 1;
const CONVERSION_ACCURACY = 2;
const MESSAGES = {
  WINNER_FIRST: 'First variant are winner.',
  WINNER_SECOND: 'Second variant are winner.',
  WINNER_EQUAL: 'Both variants are equal.',
  NOT_ENOUGH: (neededGroupSize, groupSize, deltaConversion) => {
    let missingAmount = Math.max(neededGroupSize[0] - groupSize[0], neededGroupSize[1] - groupSize[1]);
    return `It\`s not enough traffic in groups, need at least <span class="ab-calculator__mark">${(missingAmount).toLocaleString()}</span> more per both groups.`;
  },
  NO_CURRENT_GROUP: 'We can`t detect winner, because it`s relative to the group size.',
  NOT_MINIMUM_DELTA_CONVERSION: (neededDeltaConversion, deltaConversion) =>
    `Enough size of both groups riched. But waiting for minimum delta between conversion (${neededDeltaConversion}). Now both variants are equal.`,
  ERROR_CONVERSIONS_LENGTH: 'You must pass 2 conversion value, like [3, 3.2].',
  ERROR_CONVERSIONS_VALID: 'You must pass valid conversion values.',
  ERROR_GROUP_SIZE: 'You must pass 2 group size value, like [1000, 1000].',
  ERROR_GROUP_SIZE_VALID: 'You must pass currentGroupSize.',
  ERROR_ALPHA: `Alpha must be from 0 to 100 percent. Alpha set to defaul ${DEFAULT_ALPHA}.`,
  ERROR_BETA: `Beta must be from 0 to 100 percent. Beta set to default ${DEFAULT_BETA}.`,
  ERROR_RATIO: `Ratio temporarily must be only ${DEFAULT_RATIO}.`,
  ERROR_CONVERSION_MORE_THAN_GROUP: 'Conversion can`t be more than group size.'
}

let getMessage = (messageCode, ...params) => {
  if (!MESSAGES[messageCode]) {
    console.warn(`Message '${messageCode}' doesn't exist`);
    return;
  }
  if (typeof (MESSAGES[messageCode]) === 'function') {
    return MESSAGES[messageCode](...params);
  } else {
    return MESSAGES[messageCode];
  }
}

let ABCalculator = {
  constructor: (params) => {
    let data = ABCalculator._validateParams(params);
    if (data.errors) {
      let errorsText = data.errors.reduce((result, error) => {
        console.warn(error);
        result += error + '\n';
        return result;
      }, '')
      return new Error(errorsText);
    }

    let result = {
      winner: false,
      text: []
    };

    result.neededGroupSize = ABCalculator.getNeededGroupSize(data);

    if (data.groupSize && data.groupSize.length === 2 && result.neededGroupSize) {
      result.deltaConversion = ABCalculator._getDeltaConversion(data.conversionRate);
      let isEnoughDeltaConversion = !(data.neededDeltaConversion && data.neededDeltaConversion > result.deltaConversion);
      let isEnoughData = false;
      let isNeededGroupSizeInfitity = result.neededGroupSize[0] === Infinity;

      if (data.groupSize[0] >= result.neededGroupSize[0] && data.groupSize[1] >= result.neededGroupSize[1]) {
        isEnoughData = true
      }

      if (isEnoughData && isEnoughDeltaConversion) {
        if (data.conversion[0] > data.conversion[1]) {
          result.winner = 1;
          result.text.push(getMessage('WINNER_FIRST'));
        } else if (data.conversion[0] < data.conversion[1]) {
          result.winner = 2;
          result.text.push(getMessage('WINNER_SECOND'));
        } else {
          result.winner = false;
          result.text.push(getMessage('WINNER_EQUAL'));
        }
      } else if (isEnoughData && !isEnoughDeltaConversion) {
        result.winner = false;
        result.text.push(getMessage('NOT_MINIMUM_DELTA_CONVERSION', data.neededDeltaConversion, result.deltaConversion));
      } else if (isNeededGroupSizeInfitity) {
        result.winner = false;
        result.text.push(getMessage('WINNER_EQUAL'));
      } else {
        result.text.push(getMessage('NOT_ENOUGH', result.neededGroupSize, data.groupSize, result.deltaConversion));
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
  getNeededGroupSize: ({alpha, beta, conversionRate, ratio}) => {
    if (conversionRate[0] === conversionRate[1]) {
      return [Infinity, Infinity];
    }

    alpha = alpha / 100;
    beta = beta / 100;
    conversionRate = [conversionRate[0] / 100, conversionRate[1] / 100];

    let delta = Math.abs(conversionRate[0] - conversionRate[1]);
    let q1 = 1 - conversionRate[0];
    let q2 = 1 - conversionRate[1];
    let pResult = (conversionRate[0] + ratio * conversionRate[1]) / (1 + ratio);
    let qResult = 1 - pResult;
    let zValue1 = ABCalculator._computeCriticalNormalZValue(1 - alpha / 2);
    let zValue2 = ABCalculator._computeCriticalNormalZValue(1 - beta);

    let groupSize1 = Math.pow(
      (zValue1 * Math.sqrt(
        pResult * qResult * (1 + 1 / ratio)
      ) + zValue2 * Math.sqrt(
        conversionRate[0] * q1 + ((conversionRate[1] * q2) / ratio))
      )
    , 2) / Math.pow(delta, 2);
    let groupSize2 = ratio * groupSize1;

    return [
      parseInt(Math.round(groupSize1), 10),
      parseInt(Math.round(groupSize2), 10)
    ];
  },

  // Calculate delta between conversions
  _getDeltaConversion: ([conversion1, conversion2]) => {
    if (conversion2 > conversion1) {
      [conversion2, conversion1] = [conversion1, conversion2]
    }
    return Math.abs(100 - (conversion1 / (conversion2 / 100)));
  },

  _conversionToConversionRate: (sizeOfGroup, conversion) => {
    return (parseInt(conversion) / (parseInt(sizeOfGroup) / 100)).toFixed(CONVERSION_ACCURACY);
  },

  // normalize params
  _validateParams: ({alpha = DEFAULT_ALPHA, beta = DEFAULT_BETA, conversion, groupSize, ratio = DEFAULT_RATIO, neededDeltaConversion}) => {
    let result = {};
    let errors = [];
    let isGroupSizeValid =
      groupSize.length === 2 && groupSize[0] !== '' && groupSize[1] !== '' && !isNaN(groupSize[0]) && !isNaN(groupSize[1]);
    let isConversionValid =
      conversion.length === 2 && conversion[0] !== '' && conversion[1] !== '' && !isNaN(conversion[0]) && !isNaN(conversion[1]);
    alpha = parseFloat(alpha);
    beta = parseFloat(beta);
    ratio = parseFloat(ratio);

    if (isConversionValid) {
      conversion = [parseFloat(conversion[0]), parseFloat(conversion[1])];
    } else {
      if (conversion.length !== 2) {
        errors.push(getMessage('ERROR_CONVERSIONS_LENGTH'))
      }
      errors.push(getMessage('ERROR_CONVERSIONS_VALID'))
    }
    if (groupSize) {
      if (isGroupSizeValid) {
        groupSize = [parseInt(groupSize[0]), parseInt(groupSize[1])];
      } else {
        errors.push(getMessage('ERROR_GROUP_SIZE'))
      }
    } else {
      errors.push(getMessage('ERROR_GROUP_SIZE_VALID'))
    }
    if (alpha < 0 || alpha > 100 || isNaN(alpha)) {
      errors.push(getMessage('ERROR_ALPHA'));
      alpha = DEFAULT_ALPHA;
    }
    if (beta < 0 || beta > 100 || isNaN(beta)) {
      errors.push(getMessage('ERROR_BETA'));
      beta = DEFAULT_BETA;
    }
    if (isNaN(ratio) && ratio !== DEFAULT_RATIO) {
      errors.push(getMessage('ERROR_RATIO'));
      ratio = DEFAULT_RATIO;
    }

    result = {
      conversion,
      groupSize,
      ratio,
      alpha,
      beta
    }

    if (isConversionValid && isGroupSizeValid) {
      if (conversion[0] > groupSize[0] || conversion[1] > groupSize[1]) {
        errors.push(getMessage('ERROR_CONVERSION_MORE_THAN_GROUP'));
      }

      result.conversionRate = [
        parseFloat(ABCalculator._conversionToConversionRate(groupSize[0], conversion[0])),
        parseFloat(ABCalculator._conversionToConversionRate(groupSize[1], conversion[1]))
      ]
    }

    if (neededDeltaConversion && !isNaN(neededDeltaConversion)) {
      result.neededDeltaConversion = parseFloat(neededDeltaConversion);
    }

    if (errors.length) {
      result.errors = errors;
    }

    return result;
  },

  // @TODO: in future get implementation from http://jstat.github.io/test.html ?
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
      pval = ABCalculator._probabilityOfNormalZValue(zval);
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
    return ABCalculator.constructor(data);
  } else {
    return ABCalculator;
  }
}
