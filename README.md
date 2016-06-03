# AB Calculator

API:
```js
abCalculator.getSamplesSize({
  alpha: 5,                // in percent, default = 0.05
  beta: 20,                // in percent, default = 0.2
  convertions: [3.0, 3.2], // in percent, per group, only 2 group now
  ratio: 1,                // ratio of group sizes, default = 1
})
```


Api for gui plugin:
```js
abGui({
  alpha: 5,
  beta: 20,
  convertions: ['',''],
  currentGroupSizes: [],
  deltaConvertion: '',
  maxTrafficPerGroup: 10000
})
```

returned:
```js
{
  groupSizes: [parseInt(n1, 10), parseInt(ratio * n1, 10)],
  // answer: 'Для выявления победы при текущей разнице конверсий необходимо больше трафика.',// to gui
  data: {
    ...data,
    alpha: '',
    beta: '',
    convertions: [convertion1, convertion2],
    currentGroupSizes: ['group1', 'group2'],
    deltaConvertion: '', // to gui?
    // maxTrafficPerGroup: 10000, // to gui
    ratio: ''
  }
}
```
