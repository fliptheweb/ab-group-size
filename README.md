# AB Calculator ![travis](https://travis-ci.org/fliptheweb/ab-group-size.svg)
Хотите убедиться в результатах АБ-теста? Тогда этот скрипт для вас.

Нельзя просто поделить трафик на две группы и через какое-то время объявить победителя на основе наибольшей конверсии.
Результат обязан быть статистически значимым, а размер тестируемых групп удовлетворять определенным условиям. Существует несколько методов статистической проверки гипотез.
Данный калькулятор использует для расчета метод z-критерия Фишера (Z-test) с несколькими изменяемыми параметрами:
- уровень значимости (вероятность ошибки первого рода, false positive, α) — вероятность отклонить гипотезу, которая на самом деле верна.
- вероятность ошибки второго рода, false negative, β (статистическая мощность = 1 - β) — вероятность принять гипотезу, которая на самом деле ложная.
- минимальная разность конверсий при которой вариант считается победителем.

Library have browser, node.js and cli versions.

## Browser
CDN url – https://unpkg.com/ab-group-size
Init script to some DOM element
```html
<div id="ab-calculator"
  data-abcalculator-alpha="5"
  data-abcalculator-beta="20"
  data-abcalculator-needed-delta-conversion="5"
  data-abcalculator-group-size="[10000,10000]"
  data-abcalculator-conversion="[5000, 5100]"
></div>

<script src="ab_calculator.js"></script>
<script>
  ab_calculator(document.getElementById('ab-calculator'));
</script>
```
You can pass settings by:
1. Data-attributes;
2. ABCalculator initializer;
3. Fill the settings fields.

## Node.js
```sh
npm install ab-group-size
```

Usage:
```js
let ABCalculator = require('ab-group-size');

ABCalculator({
  alpha: 5,                // in percent, default = 5
  beta: 20,                // in percent, default = 20
  groupSize: [2000, 2000],
  conversion: [1000, 900]
})
```

## CLI
```sh
ab-group-size --alpha 5 --beta 20 "3, 3.2"
```

# TODO
- [x] Do nice design;
- [x] Extract browser.js to index.js with all methods;
- [x] Settings from data attribute;
- [x] Extract errors to const;
- [x] Generate html inside – html-webpack-plugin
- [x] Rewrite cli version;
- [ ] Add tests;
- [ ] test with no pass params, how it looks;
- [ ] ability to add data throught dataset https://www.dropbox.com/s/dh3e9s3h8hqz0ml/Screenshot%202016-11-28%2021.17.54.png?dl=0
- [ ] build on npm
- [ ] beta 100%, a 100 b 45?
- [x] to fix numbers;
- [x] output & libraryTarget;
- [x] add Normal readme;
- [ ] implement t-test;
- [ ] implement ANOVA-test;
