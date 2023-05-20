import { XORModel } from './model';

const trainingSet = [
  {
    input: [0, 0],
    output: [0],
  },
  {
    input: [0, 1],
    output: [1],
  },
  {
    input: [1, 0],
    output: [1],
  },
  {
    input: [1, 1],
    output: [0],
  },
];
const testSet = [
  [0, 1],
  [1, 0],
  [1, 1],
  [0, 0],
];

const model = new XORModel();
model.init();

model.train(trainingSet, {iterations: 100_000, error: 0.00001});

const result = model.activate(testSet);
console.log(result);

model.save();
