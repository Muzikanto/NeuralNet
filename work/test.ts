import {Layer, Network, Architect, Trainer, Neuron} from "synaptic";
import {RowInput} from "neural-data-normalizer/src/normalizer";
import {Normalizer} from "./utils/Normalizer/Normalizer";
import {IRowInput} from "./utils/Normalizer/Normalizer.typings";

function LSTM(input: number, blocks: number, output: number) {
    const inputLayer = new Layer(input);
    const inputGate = new Layer(blocks);
    const forgetGate = new Layer(blocks);
    const memoryCell = new Layer(blocks);
    const outputGate = new Layer(blocks);
    const outputLayer = new Layer(output);

    const inputConnect = inputLayer.project(memoryCell);
    inputLayer.project(inputGate);
    inputLayer.project(forgetGate);
    inputLayer.project(outputGate);

    const outputConnect = memoryCell.project(outputLayer);
    const self = memoryCell.project(memoryCell);

    memoryCell.project(inputGate);
    memoryCell.project(forgetGate);
    memoryCell.project(outputGate);

    inputGate.gate(inputConnect, Layer.gateType.INPUT);
    forgetGate.gate(self, Layer.gateType.ONE_TO_ONE);
    outputGate.gate(outputConnect, Layer.gateType.OUTPUT);

    inputLayer.project(outputLayer);

    return new Network({
        input: inputLayer,
        hidden: [inputGate, forgetGate, memoryCell, outputGate],
        output: outputLayer
    });
}

// const net = LSTM(1, 4, 1);
// for (let i = 0; i < 20000; i++) {
//     net.activate([0.2]);
//     net.propagate(0.01, [0.4]);
//     net.activate([0.4]);
//     net.propagate(0.01, [0.6]);
//     net.activate([0.6]);
//     net.propagate(0.01, [0.8]);
//     net.activate([0.2]);
//     net.propagate(0.01, [0.95]);
// }
// console.log(net.activate([0.2]));
//
// const normalizer = new Normalizer()
// const lstm = new Architect.LSTM(1, 4, 4, 4, 1);
//
// const trainSet = [
//     {input: [0], output: [0.1]},
//     {input: [1], output: [0.2]},
//     {input: [1], output: [0.3]},
//     {input: [0], output: [0.4]},
//     {input: [0], output: [0.5]},
//     {input: [1], output: [0.6]},
//
// ];
//
// const trainer = new Trainer(lstm);
// trainer.train(trainSet, {
//     rate: 0.2,
//     iterations: 10000,
//     error: 0.005,
//     cost: undefined,
// });
//
// const testResults = [];
// testResults[0] = lstm.activate([0]);
// testResults[1] = lstm.activate([1]);
// testResults[2] = lstm.activate([1]);
// testResults[3] = lstm.activate([0]);
// testResults[4] = lstm.activate([0]);
// testResults[5] = lstm.activate([1]);
// console.log(testResults);


class Net {
    protected normalizer = new Normalizer();
    protected net: Network = this.createNet(2, 1);

    public train(rawData: Array<RowInput>, outputFields: string[]) {
        const {inputs, outputs} = this.normalizer.normalize(rawData, outputFields);
        const {neurons: {inputLength, outputLength}} = this.normalizer.getConfig();

        this.createNet(inputLength, outputLength);

        for (let i = 0; i < 10000; i++) {
            for (let item = 0; item < sampleData.length; item++) {
                this.net.activate(inputs[item]);
                this.net.propagate(0.01, outputs[item]);
            }
        }
    }

    public run(rawData: IRowInput) {
        if (!this.net) {
            const {inputLength, outputLength} = this.normalizer.getConfig().neurons;
            this.createNet(inputLength, outputLength);
        }
        const testData = this.normalizer.singleNormalize(rawData).inputBits;
        const bites = this.net.activate(testData);

        const result = this.normalizer.denormalize(bites);

        return result;
    }

    protected createNet(inputLength: number, outputLength: number) {
        this.net = new Architect.Perceptron(inputLength, inputLength, outputLength);

        return this.net;
    }
}

const sampleData: RowInput[] = [
    {
        "soilhum": 500,
        "airtemp": 32,
        "airhum": '0',
        "water": true,
        "plants": ["tomatoes", "potatoes"],
        "tempSpan": [34, 54]
    },
    {
        "soilhum": 1050,
        "airtemp": 40,
        "airhum": '1',
        "water": true,
        "plants": ["potatoes", "asparagus"],
        "tempSpan": [24, 14]
    },
    {
        "soilhum": 300,
        "airtemp": 100,
        "airhum": '2',
        "water": false,
        "plants": ["asparagus", "tomatoes"],
        "tempSpan": [56, 4]
    },
    {
        "soilhum": 950,
        "airtemp": 103,
        "airhum": '3',
        "water": true,
        "plants": ["asparagus", "asparagus"],
        "tempSpan": [123, 2]
    },
    {
        "soilhum": 1050,
        "airtemp": 8,
        "airhum": '4',
        "water": true,
        "plants": ["tomatoes", "tomatoes"],
        "tempSpan": [67, 12]
    },
    {
        "soilhum": 1050,
        "airtemp": 56,
        "airhum": '5',
        "water": true,
        "plants": ["potatoes", "french fries"],
        "tempSpan": [45.8, 8]
    },
];

const net = new Net();
net.train(sampleData, ["airhum"]);

const testData = {
    "soilhum": 500,
    "airtemp": 30,
    "airhum": '5',
    "water": false,
    "plants": ["potatoes", "french fries"],
    "tempSpan": [8, 45.8]
};

console.log(net.run(testData));
