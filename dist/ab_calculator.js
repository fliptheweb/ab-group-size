/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ABGroupSize = __webpack_require__(1);

	var initData = {
	  alpha: 5, // optional
	  beta: 20, // optional
	  convertions: [1.2, 1.4],
	  currentGroupSizes: [], // optional
	  deltaConvertion: '' // optional
	  // maxTrafficPerGroup: 10000
	};

	var validateData = function validateData(_ref) {
	  var alpha = _ref.alpha;
	  var beta = _ref.beta;
	  var convertions = _ref.convertions;
	  var currentGroupSizes = _ref.currentGroupSizes;
	  var deltaConvertion = _ref.deltaConvertion;

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
	  };
	};

	var ABGroupSizeGui = function ABGroupSizeGui(params) {
	  var data = validateData(params);
	  // let isNeedMoreTraffic = false;
	  var result = {};

	  // validate data
	  result.groupSizes = ABGroupSize(data);

	  if (data.deltaConvertion) {
	    result.deltaGroupSizes = ABGroupSize(Object.assign({}, data, {
	      convertions: [data.convertions[0], data.convertions[0] + data.convertions[0] / 100 * data.deltaConvertion]
	    }));
	  }

	  // Сравниваем с текущими размерами групп
	  // Сравниваем с дельтой если есть
	  if (data.currentGroupSizes && data.currentGroupSizes.length === 2) {
	    var isEnoughData = false;

	    if (data.currentGroupSizes[0] >= result.groupSizes[0] && data.currentGroupSizes[1] >= result.groupSizes[1]) {
	      isEnoughData = true;
	    }

	    // if (data.currentGroupSizes[0] >= result.deltaGroupSizes[0] && data.currentGroupSizes[1] >= result.deltaGroupSizes[1]) {
	    //   result.text = 'It`s enough traffic for your delta convertions';
	    //   result.type = 'ENOUGH_TRAFFIC_DELTA';
	    // }

	    // Определяем победителя
	    if (isEnoughData) {
	      if (data.convertions[0] > data.conversions[1]) {
	        result.text = 'First group win';
	      } else if (data.convertions[0] < data.conversions[1]) {
	        result.text = 'Second group win';
	      } else {
	        result.text = 'Variants are equal';
	      }
	    }

	    if (!isEnoughData) {
	      var missingAmount = '';
	      if (result.groupSizes[0] === result.groupSizes[1]) {
	        missingAmount = result.groupSizes[0] - data.currentGroupSizes[0] + ' more in both groups';
	      } else {
	        missingAmount = result.groupSizes[0] - data.currentGroupSizes[0] + ' in first and ' + (result.groupSizes[0] - data.currentGroupSizes[0]) + ' in second group';
	      }
	      result.text = 'It`s not enough traffic in groups, need ' + missingAmount + '.';
	    }
	  }

	  return result;
	};

	document.getElementById('result').innerHTML = JSON.stringify(ABGroupSizeGui(initData), null, 2);

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	var Z_MAX = 6; // Maximum z value
	var DEFAULT_ALPHA = 5;
	var DEFAULT_BETA = 20;
	var DEFAULT_RATIO = 1;

	var ABGroupSize = {
	  /*
	    Calculation formula from http://clincalc.com/Stats/SampleSize.aspx
	    convertion1 (p1), convertion2 (p2) = proportion (incidence) of groups #1 and #2
	    delta, Δ = |p2-p1| = absolute difference between two proportions
	    α = probability of type I error (usually 0.05)
	    β = probability of type II error (usually 0.2)
	    z = critical Z value for a given α or β
	    ratio, K = ratio of sample size for group #2 to group #1
	    n1 = sample size for group #1
	    n2 = sample size for group #2
	  */
	  getGroupSize: function getGroupSize(data) {
	    var _ABGroupSize$_validat = ABGroupSize._validateData(data);

	    var alpha = _ABGroupSize$_validat.alpha;
	    var beta = _ABGroupSize$_validat.beta;
	    var convertions = _ABGroupSize$_validat.convertions;
	    var ratio = _ABGroupSize$_validat.ratio;


	    alpha = alpha / 100;
	    beta = beta / 100;
	    convertions = [convertions[0] / 100, convertions[1] / 100];

	    var delta = Math.abs(convertions[0] - convertions[1]);
	    var q1 = 1 - convertions[0];
	    var q2 = 1 - convertions[1];
	    var pResult = (convertions[0] + ratio * convertions[1]) / (1 + ratio);
	    var qResult = 1 - pResult;
	    var zValue1 = ABGroupSize._computeCriticalNormalZValue(1 - alpha / 2);
	    var zValue2 = ABGroupSize._computeCriticalNormalZValue(1 - beta);

	    var groupSize1 = Math.pow(zValue1 * Math.sqrt(pResult * qResult * (1 + 1 / ratio)) + zValue2 * Math.sqrt(convertions[0] * q1 + convertions[1] * q2 / ratio), 2) / Math.pow(delta, 2);
	    var groupSize2 = ratio * groupSize1;

	    return [parseInt(Math.round(groupSize1), 10), parseInt(Math.round(groupSize2), 10)];
	  },

	  _validateData: function _validateData(_ref) {
	    var _ref$alpha = _ref.alpha;
	    var alpha = _ref$alpha === undefined ? DEFAULT_ALPHA : _ref$alpha;
	    var _ref$beta = _ref.beta;
	    var beta = _ref$beta === undefined ? DEFAULT_BETA : _ref$beta;
	    var convertions = _ref.convertions;
	    var _ref$ratio = _ref.ratio;
	    var ratio = _ref$ratio === undefined ? DEFAULT_RATIO : _ref$ratio;

	    alpha = parseFloat(alpha);
	    beta = parseFloat(beta);
	    convertions = [parseFloat(convertions[0]), parseFloat(convertions[1])];
	    ratio = parseFloat(ratio);

	    if (alpha < 0 || alpha > 100) {
	      console.warn('Alpha must be from 0 to 100 percent. Alpha set to defaul ' + DEFAULT_ALPHA + '.');
	      alpha = DEFAULT_ALPHA;
	    }
	    if (beta < 0 || beta > 100) {
	      console.warn('Beta must be from 0 to 100 percent. Beta set to default ' + DEFAULT_BETA + '.');
	      beta = DEFAULT_BETA;
	    }
	    if (!convertions || convertions.length !== 2) {
	      try {
	        throw new Error('You must pass 2 convertions value, like [3, 3.2].');
	      } catch (err) {
	        return err;
	      }
	    }

	    return {
	      convertions: convertions,
	      ratio: ratio,
	      alpha: alpha,
	      beta: beta
	    };
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
	  _computeCriticalNormalZValue: function _computeCriticalNormalZValue(probability) {
	    var Z_EPSILON = 0.000001; // Accuracy of z approximation
	    var minz = -Z_MAX;
	    var maxz = Z_MAX;
	    var zval = 0.0;
	    var pval = void 0;

	    if (probability < 0.0 || probability > 1.0) {
	      return -1;
	    }

	    while (maxz - minz > Z_EPSILON) {
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
	  _probabilityOfNormalZValue: function _probabilityOfNormalZValue(z) {
	    var y, x, w;

	    if (z === 0.0) {
	      x = 0.0;
	    } else {
	      y = 0.5 * Math.abs(z);
	      if (y > Z_MAX * 0.5) {
	        x = 1.0;
	      } else if (y < 1.0) {
	        w = y * y;
	        x = ((((((((0.000124818987 * w - 0.001075204047) * w + 0.005198775019) * w - 0.019198292004) * w + 0.059054035642) * w - 0.151968751364) * w + 0.319152932694) * w - 0.531923007300) * w + 0.797884560593) * y * 2.0;
	      } else {
	        y -= 2.0;
	        x = (((((((((((((-0.000045255659 * y + 0.000152529290) * y - 0.000019538132) * y - 0.000676904986) * y + 0.001390604284) * y - 0.000794620820) * y - 0.002034254874) * y + 0.006549791214) * y - 0.010557625006) * y + 0.011630447319) * y - 0.009279453341) * y + 0.005353579108) * y - 0.002141268741) * y + 0.000535310849) * y + 0.999936657524;
	      }
	    }

	    return z > 0.0 ? (x + 1.0) * 0.5 : (1.0 - x) * 0.5;
	  }
	};

	module.exports = function (data) {
	  if (data) {
	    return ABGroupSize.getGroupSize(data);
	  } else {
	    return ABGroupSize;
	  }
	};

/***/ }
/******/ ]);