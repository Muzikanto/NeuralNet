import JSONReader from "../Reader/_json/JSONReader";
import {INeuralNet} from "./NeuralNet.typings";
import {Layer, Network} from 'synaptic';
import {
    INeuralStringItem,
    INeuralStringSaved,
    INeuralStringTrainItem
} from "../../features/NeuralString/NeuralString.typings";
import Utils from "../Utils";

class NeuralNet {
    protected reader = new JSONReader({pathToData: 'test'});
    protected inputSize = 10;
    protected hiddenLayers = 10;
    protected iterations = 20000;
    protected learningRate = 0.2;

    constructor(props: INeuralNet) {
        props.pathToData && (this.reader.pathToData = props.pathToData);
        props.inputSize && (this.inputSize = props.inputSize);
        props.hiddenLayers && (this.hiddenLayers = props.hiddenLayers);
        props.iterations && (this.iterations = props.iterations);
        props.learningRate && (this.learningRate = props.learningRate);
    }

    public async train(rawData: INeuralStringItem[]) {
        const trainData = rawData.map((el: INeuralStringItem, index: number, arr: INeuralStringItem[]) => ({
            value: this.prepareItem(el.input),
            id: index === 0 ? index : index / (arr.length - 1),
            ...el
        }));

        const net = this.createNet();

        const learningRate = this.learningRate;
        for (let i = 0; i < this.iterations; i++) {
            Utils.print(`Learning ${(i + 1) * trainData.length} of ${this.iterations * trainData.length}`);
            for (let j = 0; j < trainData.length; j++) {
                net.activate(trainData[j].value);
                net.propagate(learningRate, [trainData[j].id]);
            }
        }
        Utils.print('\n');

        this.reader.write('net.json', {
            network: net.toJSON(),
            trainData: trainData.map(el => {
                delete el.value;
                return el;
            })
        });
    }

    public async run(rawData: string[]) {
        const {network, trainData} = this.reader.read('net.json') as INeuralStringSaved;
        const net = Network.fromJSON(network);
        const testData = rawData.map(el => this.prepareItem(el));

        const results = [];
        for (let i = 0; i < testData.length; i++) {
            results.push(net.activate(testData[i])[0]);
        }

        return results.map(el => {
            let min = 10;
            let current: INeuralStringTrainItem | null = null;

            for (const v of trainData) {
                let diff = Math.abs(v.id - el);
                if (diff < min) {
                    min = diff;
                    current = v;
                }
            }

            return current ? (current.output ? current.output : current.input) : null;
        })
    }

    protected createNet() {
        const A = new Layer(this.inputSize);
        const B = new Layer(this.hiddenLayers);
        const C = new Layer(1);

        A.project(B);
        B.project(C);

        return new Network({
            input: A,
            hidden: [B],
            output: C
        });
    }

    protected prepareItem(str: string) {
        if (str.length > this.inputSize) {
            throw new Error(`Over input layer size: ${str}`);
        }

        const parsed = str.split('').map(ch => ch.charCodeAt(0) / Math.pow(2, 8));
        const fill = new Array(parsed.length < this.inputSize ? this.inputSize - parsed.length : 0)
            .fill(0)
            .map(el => Math.floor(Math.random()));

        return [...parsed, ...fill];
    }
}

export default NeuralNet;
