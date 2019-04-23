import JSONReader from "../Reader/_json/JSONReader";
import {INeuralInputItem, INeuralNetProps, INeuralSaved, INeuralTrainItem} from "./NeuralNet.typings";
import {Layer, Network} from 'synaptic';
import Utils from "../Utils";

abstract class NeuralNet {
    protected reader = new JSONReader({pathToData: 'dist'});
    protected inputSize = 2;
    protected hiddenLayers = 3;
    protected outputSize = 1;
    protected iterations = 20000;
    protected learningRate = 0.2;
    protected log = false;
    protected net: Network;
    protected netName = 'net';

    constructor(props: INeuralNetProps) {
        props.pathToData && (this.reader.pathToData = props.pathToData);
        props.inputSize && (this.inputSize = props.inputSize);
        props.hiddenLayers && (this.hiddenLayers = props.hiddenLayers);
        props.iterations && (this.iterations = props.iterations);
        props.learningRate && (this.learningRate = props.learningRate);
        props.log && (this.log = props.log);
        props.netName && (this.netName = props.netName);

        this.net = this.createNet();
    }

    public async train(rawData: INeuralInputItem[]) {
        const trainData = await this.prepareTrainData(rawData);

        for (let i = 0; i < this.iterations; i++) {
            this.logProcess(`Learning ${(i + 1)} of ${this.iterations}`);
            for (let j = 0; j < trainData.length; j++) {
                this.net.activate(trainData[j].values);
                this.net.propagate(this.learningRate, [trainData[j].id]);
            }
        }
        this.logProcess(`Learned ${trainData.length} data in ${this.iterations} iterations\n`);

        await this.saveData(trainData);
    }

    public async run(rawData: string[]) {
        const {network, trainData} = this.reader.read(`${this.netName}.json`) as INeuralSaved;
        this.net = Network.fromJSON(network);
        const testData = [];

        for(const v of rawData){
            testData.push(await this.prepareItem(v));
        }

        const results = [];
        for (let i = 0; i < testData.length; i++) {
            results.push(this.net.activate(testData[i])[0]);
        }

        return this.prepareOutputData(results, trainData);
    }

    protected prepareOutputData(results: number[], trainData: INeuralTrainItem[]) {
        return results.map(el => {
            let min = 10;
            let current: INeuralTrainItem | null = null;

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

    private async prepareTrainData(rawData: INeuralInputItem[]): Promise<INeuralTrainItem[]> {
        const result = [];

        for(let i = 0; i < rawData.length; i++){
            result[i] = {
                values: await this.prepareItem(rawData[i].input),
                id: i === 0 ? i : i / (rawData.length - 1),
                ...rawData[i]
            }
        }

        return result;
    }

    protected async prepareItem(item: any): Promise<number[]> {
        return item;
    }

    protected async saveData(trainData: any[]) {
        await this.reader.write(`${this.netName}.json`, {
            network: this.net.toJSON(),
            trainData: trainData.map(el => {
                delete el.values;
                return el;
            })
        });
    }

    protected createNet() {
        const time = Date.now();
        this.log && console.log('Start Create Net');
        const A = new Layer(this.inputSize);
        const B = new Layer(this.hiddenLayers);
        const C = new Layer(this.outputSize);

        A.project(B);
        this.log && console.log('Connect to Hidden', new Date(Date.now() - time).getSeconds());
        B.project(C);
        this.log && console.log('Connect to Output ', new Date(Date.now() - time).getSeconds());
        return new Network({
            input: A,
            hidden: [B],
            output: C
        });
    }

    protected logProcess(str: string) {
        this.log && Utils.print(str);
    }
}

export default NeuralNet;
