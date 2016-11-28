(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ab_calculator", [], factory);
	else if(typeof exports === 'object')
		exports["ab_calculator"] = factory();
	else
		root["ab_calculator"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	__webpack_require__(1);
	var template = __webpack_require__(6);
	var ABCalculator = __webpack_require__(7);
	var isDom = __webpack_require__(8);
	var initialized = false;
	var DEFAULT_DATA = {
	  alpha: 5,
	  beta: 20,
	  deltaConversion: 5
	};

	module.exports = function (element) {
	  if (!isDom(element)) {
	    console.log('Given element isn`t DOM element');
	    return;
	  }

	  element.innerHTML = template;

	  // Format result
	  var aGroupSizeField = element.querySelector('#a-group-size');
	  var bGroupSizeField = element.querySelector('#b-group-size');
	  var aConversionField = element.querySelector('#a-conversion');
	  var bConversionField = element.querySelector('#b-conversion');
	  var aConversionRateField = element.querySelector('#a-conversion-rate');
	  var bConversionRateField = element.querySelector('#b-conversion-rate');

	  // Settings
	  var alphaField = element.querySelector('#alpha');
	  var betaField = element.querySelector('#beta');
	  var neededDeltaConversionField = element.querySelector('#needed-delta-conversion');
	  var settingsButton = element.querySelector('#settings-button');

	  // Result
	  var resultMessage = element.querySelector('.ab-calculator__result-message');
	  var minimumGroupSize = element.querySelector('.ab-calculator__needed-group-size');
	  var deltaConversionField = element.querySelector('.ab-calculator__delta-conversion');

	  var getSettingsFromAttrubutes = function getSettingsFromAttrubutes() {
	    var settings = {};
	    var data = element.dataset;
	    var conversion = data.abcalculatorConversion;
	    var groupSize = data.abcalculatorGroupSize;
	    if (conversion) {
	      try {
	        settings.conversion = JSON.parse(conversion);
	      } catch (e) {
	        console.warn('Can\'t parse conversion from data attribute. ' + e.message);
	      }
	    }
	    if (groupSize) {
	      try {
	        settings.groupSize = JSON.parse(groupSize);
	      } catch (e) {
	        console.warn('Can\'t parse current group size from data attribute. ' + e.message);
	      }
	    }
	    if (data.abcalculatorAlpha) {
	      settings.alpha = data.abcalculatorAlpha;
	    }
	    if (data.abcalculatorBeta) {
	      settings.beta = data.abcalculatorBeta;
	    }
	    if (data.abcalculatorNeededDeltaConversion) {
	      settings.neededDeltaConversion = data.abcalculatorNeededDeltaConversion;
	    }
	    return settings;
	  };

	  var getSettingsFromFields = function getSettingsFromFields() {
	    var result = {};
	    if (alphaField.value !== '') {
	      result.alpha = alphaField.value;
	    }
	    if (betaField.value !== '') {
	      result.beta = betaField.value;
	    }
	    if (aGroupSizeField.value !== '' && bGroupSizeField.value !== '') {
	      result.groupSize = [aGroupSizeField.value, bGroupSizeField.value];
	    }
	    if (aConversionField.value !== '' && bConversionField.value !== '') {
	      result.conversion = [aConversionField.value, bConversionField.value];
	    }
	    if (neededDeltaConversionField.value !== '') {
	      result.neededDeltaConversion = neededDeltaConversionField.value;
	    }

	    return result;
	  };

	  var fillFieldFromSettings = function fillFieldFromSettings(_ref) {
	    var alpha = _ref.alpha;
	    var beta = _ref.beta;
	    var groupSize = _ref.groupSize;
	    var conversion = _ref.conversion;
	    var neededDeltaConversion = _ref.neededDeltaConversion;

	    if (alpha) {
	      alphaField.value = alpha;
	    }
	    if (beta) {
	      betaField.value = beta;
	    }
	    if (neededDeltaConversion) {
	      neededDeltaConversionField.value = neededDeltaConversion;
	    }
	    if (groupSize) {
	      aGroupSizeField.value = groupSize[0];
	      bGroupSizeField.value = groupSize[1];
	    }
	    if (conversion) {
	      aConversionField.value = conversion[0];
	      bConversionField.value = conversion[1];
	    }
	  };

	  var getDeltaConversionText = function getDeltaConversionText(deltaConversion) {
	    return 'Δ ' + (isFinite(deltaConversion) ? parseFloat(deltaConversion.toFixed(2)) + '%' : '∞');
	  };

	  var renderCalculator = function renderCalculator(settingFromParams) {
	    var data = {};
	    if (!initialized) {
	      initialized = true;
	      data = Object.assign({}, DEFAULT_DATA, getSettingsFromAttrubutes());
	      fillFieldFromSettings(data);
	    } else {
	      data = getSettingsFromFields();
	    }
	    if (!data.conversion || !data.groupSize) {
	      console.log('You must pass conversion and groups size to ABCalculator plugin');
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
	      deltaConversionField.innerHTML = getDeltaConversionText(data.deltaConversion);
	      minimumGroupSize.innerText = 'min ' + Math.max.apply(Math, _toConsumableArray(data.neededGroupSize)).toLocaleString();
	      resultMessage.innerHTML = data.text.join('<br/>');
	    } else {
	      deltaConversionField.innerHTML = '';
	      minimumGroupSize.innerText = '';
	      resultMessage.innerHTML = 'Errors: ' + data.message;
	    }
	  };

	  // Bind render to all controls
	  [alphaField, betaField, neededDeltaConversionField, aGroupSizeField, bGroupSizeField, aConversionField, bConversionField].forEach(function (control) {
	    ['change', 'click', 'keyup'].forEach(function (eventName) {
	      control.addEventListener(eventName, renderCalculator);
	    });
	  });
	  settingsButton.addEventListener('click', function () {
	    return element.classList.toggle('is-settings-opened');
	  });

	  // Initial
	  renderCalculator();
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js?importLoaders=1!./../node_modules/postcss-loader/index.js!./styles.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js?importLoaders=1!./../node_modules/postcss-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".ab-calculator {\n  all: initial;\n  display: block;\n  box-sizing: border-box;\n  font-family: 'OpenSans', Tahoma, Arial, serif;\n  padding: 10px;\n  padding-bottom: 15px;\n  width: 580px;\n  height: 190px;\n  position: relative;\n  color: #222222;\n  border: 1px solid #E4E4E4;\n  box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.10), 0px 1px 1px 0px rgba(0,0,0,0.05);\n  border-radius: 3px;\n  overflow: hidden;\n}\n.ab-calculator h3 {\n  margin: 0;\n  margin-bottom: 10px;\n  font-size: 15px;\n}\n.ab-calculator p {\n  margin: 0;\n}\n.ab-calculator__field {\n  border: 0;\n  border-radius: 2px;\n  background: #fff;\n  text-align: center;\n  height: 25px;\n  line-height: 25px;\n  font-size: 14px;\n  box-shadow: 0 0 0 2px rgba(92, 217, 253, 0.1);\n  -webkit-transition: box-shadow .3s;\n  transition: box-shadow .3s;\n  display: inline-block;\n  width: 100%;\n  padding-left: 12px;\n}\n.ab-calculator__field:focus {\n  outline: none;\n  box-shadow: 0 0 0 2px rgba(92, 217, 253, 0.5);\n}\n.ab-calculator__data {\n  width: 330px;\n  position: relative;\n  margin-top: 20px;\n}\n.ab-calculator__data::before {\n  content: '';\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 35px;\n  height: 39px;\n  background: #BDFFA4;\n  background-image: -webkit-linear-gradient(212deg, #BDFFA4 0%, #E0FFBE 100%);\n  background-image: linear-gradient(-122deg, #BDFFA4 0%, #E0FFBE 100%);\n  border-radius: 2px;\n  z-index: 0;\n  opacity: 0;\n  -webkit-transition: opacity .3s;\n  transition: opacity .3s;\n}\n.is-winner-a .ab-calculator__data::before {\n  opacity: 1;\n  top: 35px;\n}\n.is-winner-b .ab-calculator__data::before {\n  opacity: 1;\n  top: 83px;\n}\n.ab-calculator__table {\n  table-layout: fixed;\n  width: 100%;\n  position: relative;\n}\n.ab-calculator__table td, .ab-calculator__table th {\n  text-align: center;\n  padding: 0 5px;\n}\n.ab-calculator__table th {\n  color: #B1B1B1;\n  vertical-align: bottom;\n  font-size: 9px;\n  font-weight: normal;\n  padding-bottom: 10px;\n}\n.ab-calculator__heading-group {\n  width: 20px;\n  padding-right: 10px !important;\n}\n.ab-calculator__heading-group-size {\n  width: 100px;\n}\n.ab-calculator__heading-conversion {\n  width: 100px;\n}\n.ab-calculator__heading-conversion-rate {\n  width: 50px;\n}\n.ab-calculator__needed-group-size, .ab-calculator__delta-conversion {\n  font-size: 10px;\n  color: #B1B1B1;\n  white-space: nowrap;\n  height: 14px;\n}\n.ab-calculator__group {\n  font-size: 30px;\n  line-height: 30px;\n  font-weight: 600;\n  text-align: center;\n}\n.is-winner-a .ab-calculator__group.\\--a {\n  color: #48B711;\n}\n.is-winner-b .ab-calculator__group.\\--b {\n  color: #48B711;\n}\n.ab-calculator__result {\n  box-sizing: border-box;\n  font-size: 14px;\n  float: right;\n  width: 220px;\n  padding-top: 25px;\n  padding-left: 30px;\n}\n.ab-calculator__settings {\n  box-sizing: border-box;\n  width: 240px;\n  padding: 30px 45px 20px 40px;\n  background: #EEFCFF;\n  border-radius: 0 3px 3px 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  -webkit-transform: translateX(100%);\n          transform: translateX(100%);\n  -webkit-transform-origin: right;\n          transform-origin: right;\n  -webkit-transition: all .3s ease-in-out;\n  transition: all .3s ease-in-out;\n  pointer-events: none;\n}\n.ab-calculator__settings h3 {}\n.is-settings-opened .ab-calculator__settings {\n  pointer-events: auto;\n  -webkit-transform: translateX(0);\n          transform: translateX(0);\n}\n.ab-calculator__settings-row {\n  clear: both;\n  width: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin-bottom: 7px;\n}\n.ab-calculator__settings-row label {\n  color: #B1B1B1;\n  display: block;\n  font-size: 9px;\n  width: 85px;\n}\n.ab-calculator__settings-value {}\n.ab-calculator__settings-field {\n  width: 50px;\n}\n.ab-calculator__settings-percent {\n  display: inline-block;\n  font-size: 14px;\n  font-weight: 600;\n}\n.ab-calculator__settings-button {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  background: url(" + __webpack_require__(4) + ") 50% 50% no-repeat;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  /*.is-settings-opened & {\n      background-image: url('./close.svg');\n    }*/\n}\n.ab-calculator__mark {\n  color: #FF645E;\n}\n.ab-calculator.is-winner-a {}\n.ab-calculator.is-winner-b {}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjIwcHgiIGhlaWdodD0iMjBweCIgdmlld0JveD0iMCAwIDIwIDIwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0MS4yICgzNTM5NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+Z2VhcjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjIwLjAwMDAwMCwgLTIwMy4wMDAwMDApIiBmaWxsPSIjQjFCMUIxIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5MC4wMDAwMDAsIDg0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTUzMi42MjU2NDEsMTMwLjc5NDg3MiBDNTMyLjgzMDUxMywxMzEuNjI1NjQxIDUzMy4xNjg5NzQsMTMyLjQgNTMzLjYxNTEyOCwxMzMuMDk3NDM2IEw1MzIuMzY5MjMxLDEzNC4zNDg0NjIgQzUzMS44MDk3NDQsMTM0LjkwNzQzNiA1MzEuODE1Mzg1LDEzNS4yNDA3NjkgNTMyLjMwNzY5MiwxMzUuNzMzMDc3IEw1MzMuNTIzMDc3LDEzNi45NDg3MTggQzUzNC4wMjAyNTYsMTM3LjQ0NjQxIDUzNC4zNTg5NzQsMTM3LjQzNTg5NyA1MzQuOTA3NjkyLDEzNi44ODcxNzkgTDUzNi4yMTUzODUsMTM1LjU3NDYxNSBDNTM2LjgzMDc2OSwxMzUuOTI4MjA1IDUzNy40OTc0MzYsMTM2LjIgNTM4LjIwNTEyOCwxMzYuMzc0MzU5IEw1MzguMjA1MTI4LDEzNy45NzQzNTkgQzUzOC4yMDUxMjgsMTM4Ljc2OTIzMSA1MzguNDQ1ODk3LDEzOSA1MzkuMTM4NzE4LDEzOSBMNTQwLjg2MTUzOCwxMzkgQzU0MS41NjQxMDMsMTM5IDU0MS43OTQ4NzIsMTM4Ljc1MzU5IDU0MS43OTQ4NzIsMTM3Ljk3NDM1OSBMNTQxLjc5NDg3MiwxMzYuMzc0MzU5IEM1NDIuNTAyNTY0LDEzNi4yIDU0My4xNjg5NzQsMTM1LjkyODIwNSA1NDMuNzg0NjE1LDEzNS41NzQ2MTUgTDU0NS4xMjMzMzMsMTM2LjkxNzY5MiBDNTQ1LjY3NzE3OSwxMzcuNDY2NjY3IDU0Ni4wMTAyNTYsMTM3LjQ3NzE3OSA1NDYuNTA3NDM2LDEzNi45ODQ4NzIgTDU0Ny43Mjg0NjIsMTM1Ljc2Mzg0NiBDNTQ4LjIxNTEyOCwxMzUuMjc3MTc5IDU0OC4yMjU2NDEsMTM0Ljk0MzU5IDU0Ny42NjEyODIsMTM0LjM3OTc0NCBMNTQ2LjM3OTIzMSwxMzMuMDk3NjkyIEM1NDYuODMxMDI2LDEzMi40IDU0Ny4xNjk0ODcsMTMxLjYyNTg5NyA1NDcuMzc0MzU5LDEzMC43OTUxMjggTDU0OS4wNjY2NjcsMTMwLjc5NTEyOCBDNTQ5Ljc2OTIzMSwxMzAuNzk0ODcyIDU1MCwxMzAuNTQ4NDYyIDU1MCwxMjkuNzY5MjMxIEw1NTAsMTI4LjIzMDc2OSBDNTUwLDEyNy40NzE1MzggNTQ5Ljc5OTc0NCwxMjcuMjA1MTI4IDU0OS4wNjY0MSwxMjcuMjA1MTI4IEw1NDcuMzc0MTAzLDEyNy4yMDUxMjggQzU0Ny4xOTk3NDQsMTI2LjQ5NzQzNiA1NDYuOTI3OTQ5LDEyNS44MzEwMjYgNTQ2LjU3NDM1OSwxMjUuMjE1Mzg1IEw1NDcuNzk0ODcyLDEyNCBDNTQ4LjMzMzMzMywxMjMuNDYxNTM4IDU0OC4zNzkyMzEsMTIzLjEyODIwNSA1NDcuODYxNTM4LDEyMi42MTUzODUgTDU0Ni42NDEwMjYsMTIxLjM5NDg3MiBDNTQ2LjE1Mzg0NiwxMjAuOTA3NjkyIDU0NS44MDUxMjgsMTIwLjkxMzA3NyA1NDUuMjU2NDEsMTIxLjQ2MTUzOCBMNTQ0LjA5NzQzNiwxMjIuNjE1Mzg1IEM1NDMuMzk5NzQ0LDEyMi4xNjkyMzEgNTQyLjYyNTY0MSwxMjEuODMwNTEzIDU0MS43OTQ4NzIsMTIxLjYyNTg5NyBMNTQxLjc5NDg3MiwxMjAuMDI1NjQxIEM1NDEuNzk0ODcyLDExOS4yNjY0MSA1NDEuNTk0NjE1LDExOSA1NDAuODYxMjgyLDExOSBMNTM5LjEzODQ2MiwxMTkgQzUzOC40NDU4OTcsMTE5IDUzOC4yMDUxMjgsMTE5LjI1MTI4MiA1MzguMjA1MTI4LDEyMC4wMjU2NDEgTDUzOC4yMDUxMjgsMTIxLjYyNTY0MSBDNTM3LjM3NDM1OSwxMjEuODMwNTEzIDUzNi42LDEyMi4xNjg5NzQgNTM1LjkwMjU2NCwxMjIuNjE1MTI4IEw1MzQuNzQzNTksMTIxLjQ2MTI4MiBDNTM0LjE5NDYxNSwxMjAuOTEyODIxIDUzMy44NDYxNTQsMTIwLjkwNzQzNiA1MzMuMzU4OTc0LDEyMS4zOTQ2MTUgTDUzMi4xMzg0NjIsMTIyLjYxNTEyOCBDNTMxLjYyMDUxMywxMjMuMTI3OTQ5IDUzMS42NjY2NjcsMTIzLjQ2MTUzOCA1MzIuMjA1MTI4LDEyMy45OTk3NDQgTDUzMy40MjA1MTMsMTI1LjIxNTEyOCBDNTMzLjA3MjA1MSwxMjUuODMwNTEzIDUzMi44LDEyNi40OTcxNzkgNTMyLjYyNTY0MSwxMjcuMjA0ODcyIEw1MzAuOTMzMzMzLDEyNy4yMDQ4NzIgQzUzMC4yNDA3NjksMTI3LjIwNTEyOCA1MzAsMTI3LjQ1NjQxIDUzMCwxMjguMjMwNzY5IEw1MzAsMTI5Ljc2OTIzMSBDNTMwLDEzMC41NjQxMDMgNTMwLjI0MDc2OSwxMzAuNzk0ODcyIDUzMC45MzM1OSwxMzAuNzk0ODcyIEw1MzIuNjI1NjQxLDEzMC43OTQ4NzIgTDUzMi42MjU2NDEsMTMwLjc5NDg3MiBaIE01MzcuMDY2NDEsMTI5IEM1MzcuMDY2NDEsMTI3LjM3OTQ4NyA1MzguMzc5NDg3LDEyNi4wNjY5MjMgNTQwLDEyNi4wNjY5MjMgQzU0MS42MjA1MTMsMTI2LjA2NjkyMyA1NDIuOTMzMDc3LDEyNy4zNzk0ODcgNTQyLjkzMzA3NywxMjkgQzU0Mi45MzMwNzcsMTMwLjYyMDUxMyA1NDEuNjIwNTEzLDEzMS45MzM1OSA1NDAsMTMxLjkzMzU5IEM1MzguMzc5NDg3LDEzMS45MzM1OSA1MzcuMDY2NDEsMTMwLjYyMDUxMyA1MzcuMDY2NDEsMTI5IEw1MzcuMDY2NDEsMTI5IFoiIGlkPSJnZWFyIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "<div class=\"ab-calculator\">\n  <div class=\"ab-calculator__result\">\n    <h3>Result:</h3>\n    <p class=\"ab-calculator__result-message\"></p>\n  </div>\n  <div class=\"ab-calculator__data\">\n    <table class=\"ab-calculator__table\">\n      <thead>\n        <tr>\n          <th class=\"ab-calculator__heading-group\"></th>\n          <th class=\"ab-calculator__heading-group-size\">The number of visitors on page was:</th>\n          <th class=\"ab-calculator__heading-conversion\">The number of overall conversions was:</th>\n          <th class=\"ab-calculator__heading-conversion-rate\">Convertion rate:</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td class=\"ab-calculator__group --a\">A</td>\n          <td><input id=\"a-group-size\" class=\"ab-calculator__field\" type=\"number\" min=\"0\" step=\"1\"/></td>\n          <td><input id=\"a-conversion\" class=\"ab-calculator__field\" type=\"number\" min=\"0\" step=\"1\"/></td>\n          <td id=\"a-conversion-rate\"></td>\n        </tr>\n        <tr>\n          <td></td>\n          <td class=\"ab-calculator__needed-group-size\" title=\"Minimum group size for statistical significance\"></td>\n          <td></td>\n          <td class=\"ab-calculator__delta-conversion\" title=\"Relative delta between conversion rates\"></td>\n        </tr>\n        <tr>\n          <td class=\"ab-calculator__group --b\">B</td>\n          <td><input id=\"b-group-size\" class=\"ab-calculator__field\" type=\"number\" min=\"0\" step=\"1\"/></td>\n          <td><input id=\"b-conversion\" class=\"ab-calculator__field\" type=\"number\" min=\"0\" step=\"1\"/></td>\n          <td id=\"b-conversion-rate\"></td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n  <div class=\"ab-calculator__settings\">\n    <h3>Settings:</h3>\n    <div class=\"ab-calculator__settings-row\">\n      <label for=\"\">Alpha (I-type error):</label>\n      <div class=\"ab-calculator__settings-value\">\n        <input id=\"alpha\" class=\"ab-calculator__field ab-calculator__settings-field\" type=\"number\" min=\"0\" max=\"100\" step=\"1\"/>\n        <span class=\"ab-calculator__settings-percent\">%</span>\n      </div>\n    </div>\n    <div class=\"ab-calculator__settings-row\">\n      <label for=\"\">Beta (II-type error):</label>\n      <div class=\"ab-calculator__settings-value\">\n        <input id=\"beta\" class=\"ab-calculator__field ab-calculator__settings-field\" type=\"number\" min=\"0\" max=\"100\" step=\"1\"/>\n        <span class=\"ab-calculator__settings-percent\">%</span>\n      </div>\n    </div>\n    <div class=\"ab-calculator__settings-row\">\n      <label for=\"\">Minimum delta conversion:</label>\n      <div class=\"ab-calculator__settings-value\">\n        <input id=\"needed-delta-conversion\" class=\"ab-calculator__field ab-calculator__settings-field\" type=\"number\" min=\"0\" max=\"100\" step=\"1\"/>\n        <span class=\"ab-calculator__settings-percent\">%</span>\n      </div>\n    </div>\n  </div>\n  <span class=\"ab-calculator__settings-button\" id=\"settings-button\"></span>\n</div>\n";

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var Z_MAX = 6; // Maximum z value
	var DEFAULT_ALPHA = 5;
	var DEFAULT_BETA = 20;
	var DEFAULT_RATIO = 1;
	var CONVERSION_ACCURACY = 2;
	var MESSAGES = {
	  WINNER_FIRST: 'First variant are winner.',
	  WINNER_SECOND: 'Second variant are winner.',
	  WINNER_EQUAL: 'Both variants are equal.',
	  NOT_ENOUGH: function NOT_ENOUGH(neededGroupSize, groupSize, deltaConversion) {
	    var missingAmount = Math.max(neededGroupSize[0] - groupSize[0], neededGroupSize[1] - groupSize[1]);
	    return 'It`s not enough traffic in groups, need at least <span class="ab-calculator__mark">' + missingAmount.toLocaleString() + '</span> more per both groups.';
	  },
	  NO_CURRENT_GROUP: 'We can`t detect winner, because it`s relative to the group size.',
	  NOT_MINIMUM_DELTA_CONVERSION: function NOT_MINIMUM_DELTA_CONVERSION(neededDeltaConversion, deltaConversion) {
	    return 'Enough size of both groups riched. But waiting for minimum delta between conversion (' + neededDeltaConversion + '). Now both variants are equal.';
	  },
	  ERROR_CONVERSIONS_LENGTH: 'You must pass 2 conversion value, like [3, 3.2].',
	  ERROR_CONVERSIONS_VALID: 'You must pass valid conversion values.',
	  ERROR_GROUP_SIZE: 'You must pass 2 group size value, like [1000, 1000].',
	  ERROR_GROUP_SIZE_VALID: 'You must pass currentGroupSize.',
	  ERROR_ALPHA: 'Alpha must be from 0 to 100 percent. Alpha set to defaul ' + DEFAULT_ALPHA + '.',
	  ERROR_BETA: 'Beta must be from 0 to 100 percent. Beta set to default ' + DEFAULT_BETA + '.',
	  ERROR_RATIO: 'Ratio temporarily must be only ' + DEFAULT_RATIO + '.',
	  ERROR_CONVERSION_MORE_THAN_GROUP: 'Conversion can`t be more than group size.'
	};

	var getMessage = function getMessage(messageCode) {
	  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    params[_key - 1] = arguments[_key];
	  }

	  if (!MESSAGES[messageCode]) {
	    console.warn('Message \'' + messageCode + '\' doesn\'t exist');
	    return;
	  }
	  if (typeof MESSAGES[messageCode] === 'function') {
	    return MESSAGES[messageCode].apply(MESSAGES, params);
	  } else {
	    return MESSAGES[messageCode];
	  }
	};

	var ABCalculator = {
	  constructor: function constructor(params) {
	    var data = ABCalculator._validateParams(params);
	    if (data.errors) {
	      var errorsText = data.errors.reduce(function (result, error) {
	        console.warn(error);
	        result += error + '\n';
	        return result;
	      }, '');
	      return new Error(errorsText);
	    }

	    var result = {
	      winner: false,
	      text: []
	    };

	    result.neededGroupSize = ABCalculator.getNeededGroupSize(data);

	    if (data.groupSize && data.groupSize.length === 2 && result.neededGroupSize) {
	      result.deltaConversion = ABCalculator._getDeltaConversion(data.conversionRate);
	      var isEnoughDeltaConversion = !(data.neededDeltaConversion && data.neededDeltaConversion > result.deltaConversion);
	      var isEnoughData = false;
	      var isNeededGroupSizeInfitity = result.neededGroupSize[0] === Infinity;

	      if (data.groupSize[0] >= result.neededGroupSize[0] && data.groupSize[1] >= result.neededGroupSize[1]) {
	        isEnoughData = true;
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

	    return Object.assign({}, data, result);
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
	  getNeededGroupSize: function getNeededGroupSize(_ref) {
	    var alpha = _ref.alpha;
	    var beta = _ref.beta;
	    var conversionRate = _ref.conversionRate;
	    var ratio = _ref.ratio;

	    if (conversionRate[0] === conversionRate[1]) {
	      return [Infinity, Infinity];
	    }

	    alpha = alpha / 100;
	    beta = beta / 100;
	    conversionRate = [conversionRate[0] / 100, conversionRate[1] / 100];

	    var delta = Math.abs(conversionRate[0] - conversionRate[1]);
	    var q1 = 1 - conversionRate[0];
	    var q2 = 1 - conversionRate[1];
	    var pResult = (conversionRate[0] + ratio * conversionRate[1]) / (1 + ratio);
	    var qResult = 1 - pResult;
	    var zValue1 = ABCalculator._computeCriticalNormalZValue(1 - alpha / 2);
	    var zValue2 = ABCalculator._computeCriticalNormalZValue(1 - beta);

	    var groupSize1 = Math.pow(zValue1 * Math.sqrt(pResult * qResult * (1 + 1 / ratio)) + zValue2 * Math.sqrt(conversionRate[0] * q1 + conversionRate[1] * q2 / ratio), 2) / Math.pow(delta, 2);
	    var groupSize2 = ratio * groupSize1;

	    return [parseInt(Math.round(groupSize1), 10), parseInt(Math.round(groupSize2), 10)];
	  },

	  // Calculate delta between conversions
	  _getDeltaConversion: function _getDeltaConversion(_ref2) {
	    var _ref3 = _slicedToArray(_ref2, 2);

	    var conversion1 = _ref3[0];
	    var conversion2 = _ref3[1];

	    if (conversion2 > conversion1) {
	      var _ref4 = [conversion1, conversion2];
	      conversion2 = _ref4[0];
	      conversion1 = _ref4[1];
	    }
	    return Math.abs(100 - conversion1 / (conversion2 / 100));
	  },

	  _conversionToConversionRate: function _conversionToConversionRate(sizeOfGroup, conversion) {
	    return (parseInt(conversion) / (parseInt(sizeOfGroup) / 100)).toFixed(CONVERSION_ACCURACY);
	  },

	  // normalize params
	  _validateParams: function _validateParams(_ref5) {
	    var _ref5$alpha = _ref5.alpha;
	    var alpha = _ref5$alpha === undefined ? DEFAULT_ALPHA : _ref5$alpha;
	    var _ref5$beta = _ref5.beta;
	    var beta = _ref5$beta === undefined ? DEFAULT_BETA : _ref5$beta;
	    var conversion = _ref5.conversion;
	    var groupSize = _ref5.groupSize;
	    var _ref5$ratio = _ref5.ratio;
	    var ratio = _ref5$ratio === undefined ? DEFAULT_RATIO : _ref5$ratio;
	    var neededDeltaConversion = _ref5.neededDeltaConversion;

	    var result = {};
	    var errors = [];
	    var isGroupSizeValid = groupSize.length === 2 && groupSize[0] !== '' && groupSize[1] !== '' && !isNaN(groupSize[0]) && !isNaN(groupSize[1]);
	    var isConversionValid = conversion.length === 2 && conversion[0] !== '' && conversion[1] !== '' && !isNaN(conversion[0]) && !isNaN(conversion[1]);
	    alpha = parseFloat(alpha);
	    beta = parseFloat(beta);
	    ratio = parseFloat(ratio);

	    if (isConversionValid) {
	      conversion = [parseFloat(conversion[0]), parseFloat(conversion[1])];
	    } else {
	      if (conversion.length !== 2) {
	        errors.push(getMessage('ERROR_CONVERSIONS_LENGTH'));
	      }
	      errors.push(getMessage('ERROR_CONVERSIONS_VALID'));
	    }
	    if (groupSize) {
	      if (isGroupSizeValid) {
	        groupSize = [parseInt(groupSize[0]), parseInt(groupSize[1])];
	      } else {
	        errors.push(getMessage('ERROR_GROUP_SIZE'));
	      }
	    } else {
	      errors.push(getMessage('ERROR_GROUP_SIZE_VALID'));
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
	      conversion: conversion,
	      groupSize: groupSize,
	      ratio: ratio,
	      alpha: alpha,
	      beta: beta
	    };

	    if (isConversionValid && isGroupSizeValid) {
	      if (conversion[0] > groupSize[0] || conversion[1] > groupSize[1]) {
	        errors.push(getMessage('ERROR_CONVERSION_MORE_THAN_GROUP'));
	      }

	      result.conversionRate = [parseFloat(ABCalculator._conversionToConversionRate(groupSize[0], conversion[0])), parseFloat(ABCalculator._conversionToConversionRate(groupSize[1], conversion[1]))];
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
	    return ABCalculator.constructor(data);
	  } else {
	    return ABCalculator;
	  }
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	/*global window*/

	/**
	 * Check if object is dom node.
	 *
	 * @param {Object} val
	 * @return {Boolean}
	 * @api public
	 */

	module.exports = function isNode(val){
	  if (!val || typeof val !== 'object') return false;
	  if (window && 'object' == typeof window.Node) return val instanceof window.Node;
	  return 'number' == typeof val.nodeType && 'string' == typeof val.nodeName;
	}


/***/ }
/******/ ])
});
;