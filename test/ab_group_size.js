import test from 'ava';
import ABGroupSize from '../src/index';

const INIT_DATA_SAMPLES = [
  {
    data: {
      alpha: 10,
      beta: 10,
      convertions: [3, 3.2]
    },
    result: [128623, 128623]
  },
  {
    data: {
      convertions: [10, 15],
      ratio: 2
    },
    result: [525, 1050]
  }
]

test('With alpha and beta', t => {
  t.deepEqual(ABGroupSize(INIT_DATA_SAMPLES[0].data), INIT_DATA_SAMPLES[0].result);
});

test('With ratio', t => {
  t.deepEqual(ABGroupSize(INIT_DATA_SAMPLES[0].data), INIT_DATA_SAMPLES[0].result);
});
