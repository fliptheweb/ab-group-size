const Z_MAX = 6; // Maximum �z value
const ROUND_FLOAT = 6; // Decimal places to round numbers

/*  TRIMFLOAT  --  Trim floating point number to a given
                   number of digits after the decimal point.  */

function trimfloat(n, digits) {
  var dp, nn, i;

  n += "";
  dp = n.indexOf(".");
  if (dp != -1) {
      nn = n.substring(0, dp + 1);
      dp++;
      for (i = 0; i < digits; i++) {
          if (dp < n.length) {
              nn += n.charAt(dp);
              dp++;
          } else {
              break;
          }
      }

      /* Now we want to round the number.  If we're not at
         the end of number and the next character is a digit
         >= 5 add 10^-digits to the value so far. */

      if (dp < n.length && n.charAt(dp) >= '5' &&
                           n.charAt(dp) <= '9') {
          var rd = 0.1, rdi;

          for (rdi = 1; rdi < digits; rdi++) {
              rd *= 0.1;
          }
          rd += parseFloat(nn);
          rd += "";
          nn = rd.substring(0, nn.length);
          nn += "";
      }

      //  Ditch trailing zeroes in decimal part

      while (nn.length > 0 && nn.charAt(nn.length - 1) == '0') {
          nn = nn.substring(0, nn.length - 1);
      }

      //  Skip excess decimal places before exponent

      while (dp < n.length && n.charAt(dp) >= '0' &&
                              n.charAt(dp) <= '9') {
          dp++;
      }

      //  Append exponent, if any

      if (dp < n.length) {
          nn += n.substring(dp, n.length);
      }
      n = nn;
  }
  return n;
}

/*  CRITZ  --  Compute critical normal z value to
               produce given p.  We just do a bisection
               search for a value within CHI_EPSILON,
               relying on the monotonicity of pochisq().
*/

function critz(p) {
    var Z_EPSILON = 0.000001;     /* Accuracy of z approximation */
    var minz = -Z_MAX;
    var maxz = Z_MAX;
    var zval = 0.0;
    var pval;

    if (p < 0.0 || p > 1.0) {
        return -1;
    }

    while ((maxz - minz) > Z_EPSILON) {
        pval = poz(zval);
        if (pval > p) {
            maxz = zval;
        } else {
            minz = zval;
        }
        zval = (maxz + minz) * 0.5;
    }
    return(zval);
}


let normalizeInitData = (initData) -> {
// @todo normalize string values with ., and space
// @todo validate
  return {
    ...initData,
    alpha: initData.alpha / 100,
    beta: initData.beta / 100,
    significance: 1 - (initData.alpha / 100),
    power: 1 - (initData.beta / 100),
    convertion1: initData.convertion1 / 100,
    convertion2: initData.convertion2 / 100,
  }
}

// Sample size
let initData = {
  alpha: 5,
  beta: 20,
  convertion1: 3,
  convertion2: 3.2, // or delta_convertion: 5
  ratio: 1,
  trafficMax: 500000
}

console.log(getSampleSize(normalizeInitData(initData)))

getSampleSize = ({alpha, beta, convertion1, convertion2, ration, trafficMax}) -> {
  // Calculation formula from http://clincalc.com/Stats/SampleSize.aspx
  // convertion1 (p1), convertion2 (p2) = proportion (incidence) of groups #1 and #2
  // delta, Δ = |p2-p1| = absolute difference between two proportions
  // n1 = sample size for group #1
  // n2 = sample size for group #2
  // α = probability of type I error (usually 0.05)
  // β = probability of type II error (usually 0.2)
  // z = critical Z value for a given α or β
  // ratio, K = ratio of sample size for group #2 to group #1
  let delta = convertion1 - convertion2;
  let q1 = 1 - convertion1;
  let q2 = 1 - convertion2;
  let p_result = (convertion1 + ratio * convertion2) / (1 + ratio);
  let q_result = 1 - p_result;
  let z_value1 = calculateZValue(1 - alpha/2);
  let z_value2 = calculateZValue(1 - beta);
  let n = Math.pow((z_value1 * Math.sqrt(p_result * q_result * (1 + 1/ratio)) + z_value2 * Math.sqrt(convertion1 * q1 + ((convertion2 * q2)/ratio))), 2) / Math.pow(delta, 2)
}

calculateZValue = (probability) -> {
  // @todo implementation from http://jstat.github.io/test.html ?
  // Calculation formula from http://sampson.byu.edu/courses/z2p2z-calculator.html
  // Probability (p): p = 1 - α/2.
  if (probability < 0 || probability > 1) {
    console.log("Probability (Q) must be between 0 and 1.");
  } else {
    trimfloat(critz(probability), ROUND_FLOAT);
  }
}
