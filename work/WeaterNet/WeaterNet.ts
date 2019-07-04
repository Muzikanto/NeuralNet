import {INeuralNetworkTrainingOptions, recurrent} from "brain.js";
import LSTMTimeStep = recurrent.LSTMTimeStep;
import * as fs from "fs";

const brain = require('brain.js');

class WeaterNet {
    protected net: LSTMTimeStep;
    protected maxValue = 30;

    constructor() {
        this.net = new brain.recurrent.LSTMTimeStep();
    }

    public train(rawData: number[], options: INeuralNetworkTrainingOptions = {}) {
        const trainData = this.prepareData(rawData);

        return this.net.train([trainData], options);
    }

    public run(rawData: number[]) {
        const testData = this.prepareData(rawData);

        return this.net.run<number[], number>(testData) * this.maxValue;
    }

    public forecast(rawData: number[], count: number = 3) {
        const testData = this.prepareData(rawData);
        const result = this.net.forecast<number[], number[]>(testData, count);

        return result.map(el => el * this.maxValue)
    }

    protected prepareData(rawData: number[]) {
        return rawData.map(el => el / this.maxValue);
    }

    public load() {
        this.net.fromJSON(JSON.parse(fs.readFileSync(`./work/net.json`, {encoding: 'utf8'})));
    }

    public async save() {
        const content = JSON.stringify(this.net.toJSON(), null, 2);
        fs.writeFileSync(`./work/net.json`, content);
    }
}

export default WeaterNet;
