# AB Group Size ![travis](https://travis-ci.org/fliptheweb/ab-group-size.svg)
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
  conversions: [3.0, 3.2], // in percent, per group, only 2 groups now
  ratio: 1                 // ratio of group sizes, default = 1
})
```

CLI version:
```sh
ab-group-size --alpha 5 --beta 20 "3, 3.2"
```

# TODO
- [ ] Save settings to cookies
- [ ] Extract browser.js to index.js with all methods
- [ ] Add tests
- [ ] Rewrite cli version
