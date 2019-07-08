import {Network, Architect} from "synaptic";
import * as fs from "fs";
import INet from './Net.typings';

class Net {
    protected net: Network;
    protected fileName: string = 'net';
    protected filePath: string = `dist/${this.fileName}.json`;
    protected baseTrainOptions = {
        log: false,
        iterations: 20000,
        logPeriod: 10,
        callbackPeriod: 1,
        rate: 0.05,
    };

    constructor() {
        this.net = this.createNet(2, 3, 1);
    }

    public train(rawData: any, options?: INet.TrainOptionsRaw) {
        console.log('Start Train');
        const config: INet.TrainOptions = {
            ...this.baseTrainOptions,
            ...options,
            startTime: new Date().getTime(),
        };
        const trainData = this.prepareTrainData(rawData);

        for (let iteration = 0; iteration < config.iterations; iteration++) {
            for (const trainItem of trainData) {
                this.trainIteration(trainItem, config);

                if (config.log && (iteration % config.logPeriod === 0 || iteration === config.iterations - 1)) {
                    const one = (new Date().getTime() - config.startTime) / (iteration + 1);
                    const timeWait = (config.iterations * one - (iteration + 1) * one) / 1000;
                    this.printProgress('Iteration: ' + (iteration + 1) + ' wait ' + timeWait.toFixed(2) + 's');
                }

                if (config.callback && iteration % config.callbackPeriod === 0) {
                    config.callback(iteration);
                }
            }
        }

        const doneTime = new Date().getTime() - config.startTime;
        console.log(`Time: ${(doneTime / 1000).toFixed(2)}s\n`);
    };

    public run(rawData: any): any {
        console.log('Start Test');
        const startTime = new Date();
        const testData = this.prepareTestData(rawData);

        const result = this.runActivations(testData);

        const doneTime = new Date().getTime() - startTime.getTime();
        console.log(`Time: ${(doneTime / 1000).toFixed(2)}s\n`);

        return result;
    };

    public save() {
        const netContent = this.net.toJSON();
        const fileContent = JSON.stringify(netContent, null, 2);
        fs.writeFileSync(this.filePath, fileContent);
    }

    public load() {
        const fileContent = fs.readFileSync(this.filePath, {encoding: 'utf8'});
        const netContent = JSON.parse(fileContent);
        this.net = Network.fromJSON(netContent)
    }

    public restore() {
        this.net.reset();
        this.net.restore();
    }

    protected trainIteration({input, output}: INet.TrainItem, config: INet.TrainOptions) {
        this.net.activate(input);
        this.net.propagate(config.rate, output);
    }

    protected prepareTrainData(rawData: any): INet.TrainData {
        return rawData;
    }

    protected prepareTestData(rawData: any): number[] {
        return rawData;
    }

    protected runActivations(testData: number[]): any {
        return this.net.activate(testData);
    }

    protected createNet(inputNeurons: number, hiddenNeurons: number, outputNeurons: number): Network {
        return new Architect.Perceptron(inputNeurons, hiddenNeurons, outputNeurons);
    }

    protected printProgress(message: string) {
        // @ts-ignore
        process.stdout.clearLine();
        // @ts-ignore
        process.stdout.cursorTo(0);
        process.stdout.write(message);
    }
}

export default Net;
