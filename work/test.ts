import testCommonNet from "./Net/test";
import testObjectsNet from "./ObjectsNet/test";

// const net = LSTM(1, [4, 4, 4], 1);
// const normalizer = new Normalizer();

// const rawTrain: RowInput[] = [
//     {input: 1, output: 2},
//     {input: 2, output: 3},
//     {input: 3, output: 4},
//     {input: 4, output: 5},
//     {input: 5, output: 6},
//     {input: 6, output: 7},
//     {input: 7, output: 8},
//     {input: 8, output: 9},
// ];
// const trainData = normalizer.normalize(rawTrain, ['output']);
//
// for (let i = 0; i < 20000; i++) {
//     console.log(i)
//     for (const v of trainData) {
//         net.activate(v.input);
//         net.propagate(0.01, v.output);
//     }
// }
//
// const testData = [
//     {input: 3},
//     {input: 4},
//     {input: 5},
// ].map(el => normalizer.singleNormalize(el));

// console.log(predict(testData));
//
//
// function predict(test: RowInput[], predictCount: number = 1) {
//     const arr = [];
//     const firstSize = test.length;
//     let currentPredict = 1;
//
//     for (let i = 0; i < test.length; i++) {
//         const bits = net.activate(testData[i].input);
//         const result = Math.round(normalizer.denormalize(bits).output as number);
//
//         arr.push(result);
//         if (i + 1 >= firstSize && currentPredict <= predictCount) {
//             testData.push(normalizer.singleNormalize({input: result}));
//             currentPredict++;
//         }
//     }
//
//     return arr;
// }

testCommonNet();
console.log('-------------');
testObjectsNet();
