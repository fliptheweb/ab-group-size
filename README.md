# AB Group Size
Simple calculator for computing group size of A/B tests.

Installation:
```sh
npm install --save ab-group-size
```

Usage:
```js
let ABGroupSize = require('ab-group-size');

ABGroupSize({
  alpha: 5,                // in percent, default = 5
  beta: 20,                // in percent, default = 20
  convertions: [3.0, 3.2], // in percent, per group, only 2 groups now
  ratio: 1                 // ratio of group sizes, default = 1
})
```

CLI version:
```sh
ab-group-size --alpha 5 --beta 20 "3, 3.2"
```