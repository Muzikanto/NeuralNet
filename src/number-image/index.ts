// @ts-ignore
import mnist from 'mnist';
import { NumberImageModel } from './model';

const TRAINING_SET_SIZE = 3000;
const TEST_SET_SIZE = 50;

console.log('Initialize training data');
const { training, test } = mnist.set(TRAINING_SET_SIZE, TEST_SET_SIZE);

console.log('Initialize neural network');
const model = new NumberImageModel();
model.init();

console.log('Train neural network');
model.train(training, {
  iterations: 100,
  log: 1,
  schedule: {
    every: 10,
    do: (opts) => {
      run(opts.iterations, training);
      model.save();
    },
  },
});

console.log('Activate neural network');
run(-1, training);

model.save();

function run(iterations: number, data: Array<{ input: number[]; output: number[] }>): void {
  const res = data.map((el: any) => [model.formatItem(model.activate(el.input)), model.formatItem(el.output)]);
  const success = res.filter((el: any) => el[0] === el[1]);
  const error = res.filter((el: any) => (el[0]! -= el[1]));

  console.log(`Iterations: ${iterations}, Success: ${success.length}, Error: ${error.length}`);
}
