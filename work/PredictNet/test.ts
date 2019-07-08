import PredictNet from "./PredictNet";
import {RowInput} from "neural-data-normalizer/src/normalizer";

function testPredictNumbers() {
    const net = new PredictNet();

    const rawTrain: RowInput[] = [
        {input: 1, output: 2},
        {input: 2, output: 3},
        {input: 3, output: 4},
        {input: 4, output: 5},
        {input: 5, output: 6},
        {input: 6, output: 7},
        {input: 7, output: 8},
        {input: 8, output: 9},
    ];

    net.train(rawTrain, {
        log: true, iterations: 2000
    });
    net.save();

    net.load();
    const testData = [
        {input: 1},
        {input: 2},
        {input: 3},
    ];

    const result = net.run(testData, 2);

    console.log(result);
}

export default testPredictNumbers;
