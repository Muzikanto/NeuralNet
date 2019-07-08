import PredictNet from "./PredictNet";
import {RowInput} from "neural-data-normalizer/src/normalizer";

async function testWeatherNet() {
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

    net.train(rawTrain);

    const testData = [
        {input: 3},
        {input: 4},
        {input: 5},
    ];

    const result = net.run(testData);

    console.log(result);
}

export default testWeatherNet;
