import {Network, Architect} from "synaptic";
import * as fs from "fs";
import INet from './Net.typings';

class Net {
    protected net: Network;
    protected fileName: string = 'net';
    protected filePath: string = `dist/${this.fileName}.json`;

    constructor() {
        this.net = this.createNet();
    }

    public train(rawData: INet.TrainData, options?: INet.TrainOptionsRaw) {
        console.log('Start Train');
        const config = this.prepareTrainConfig(options);
        const trainData = rawData;

        for (let iteration = 0; iteration < config.iterations; iteration++) {
            for (const trainItem of trainData) {
                this.net.activate(trainItem.input);
                this.net.propagate(.12, trainItem.output);

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

    public run(rawData: any) {
        console.log('Start Test');
        const startTime = new Date();

        const result = this.net.activate(rawData);

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

    protected prepareTrainConfig(options?: INet.TrainOptionsRaw): INet.TrainOptions {
        return {
            ...{
                log: false,
                iterations: 20000,
                logPeriod: 10,
                callbackPeriod: 1,
                startTime: new Date().getTime(),
            },
            ...options,
        };
    }

    protected createNet() {
        return new Architect.Perceptron(2, 3, 1);
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
