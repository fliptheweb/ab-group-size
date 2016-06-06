#!/usr/bin/env node --harmony

let program = require('commander');
let packageJson = require('../package.json');
let ABGroupSize = require('../');

program
  .version(packageJson.version)
  .usage('[options] <convertions>')
  .description(packageJson.description)
  .option('-a, --alpha <percent>', 'Type I error, false positive. Default 5.', parseFloat)
  .option('-b, --beta <percent>', 'Type II error, false negative. Default 20.', parseFloat)
  .option('-r, --ratio <ratio>', 'Ratio of groups. Default 1(equal groups).', parseFloat)
  .action(function (convertions) {
    try {
      convertions = convertions.split(',');
      if (convertions.length !== 2) {
        throw new Error('You must pass 2 convertions value, like "3, 3.2"');
      }
      console.log('Group sizes for A/B test – ', ABGroupSize({
        alpha: program.alpha,
        beta: program.beta,
        ratio: program.ratio,
        convertions: program.args[0].split(',')
      }))
    } catch (error) {
      console.error(error.message)
    }
  });

program.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ ab-group-size --alpha 5 --beta 20 "3, 3.2"');
  console.log('');
});

program.parse(process.argv);

if (!program.args.length) program.help();
