# AB Group Size ![travis](https://travis-ci.org/fliptheweb/ab-group-size.svg)
Simple calculator for computing group size of A/B tests.

Installation:

Library have browser, node.js and cli versions.

## Browser
You can pass settings by:
1. Data-attributes;
2. ABGroupSize initializer;
3. Fill the settings fields.

## Node.js
```sh
npm install --save ab-group-size
```

Usage:
```js
let ABGroupSize = require('ab-group-size');

ABGroupSize({
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
- [ ] Rewrite cli version;
- [ ] Add tests;
- [ ] to fix numbers
- [ ] output & libraryTarget
