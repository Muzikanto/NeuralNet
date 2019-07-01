import {NeuralNetwork} from "brain.js";

const fs = require('fs');
const brain = require('brain.js');

class Net {
    protected net: NeuralNetwork;

    constructor() {
        this.net = new brain.NeuralNetwork()
    }

    public async train(rawData: any, log: boolean = false) {
        const trainData = this.prepareTrainData(rawData);
        this.net.train(trainData, {logPeriod: 1000, log, iterations: 50000});
        await this.save();
    }

    public async run(rawData: any): Promise<Float32Array> {
        const trainData = this.prepareTestData(rawData);

        return this.net.run(trainData);
    }

    public load() {
        this.net.fromJSON(JSON.parse(fs.readFileSync(`./work/net.json`)));
    }

    public async save() {
        const content = JSON.stringify(this.net.toJSON(), null, 2);
        fs.writeFileSync(`./work/net.json`, content, () => {});
    }

    protected prepareTrainData(rawData: any) {
        return rawData.map(this.prepareItem.bind(this));
    }

    protected prepareTestData(rawData: any) {
        return rawData.map(this.prepareItem.bind(this));
    }

    protected prepareItem(v: any) {
        return v;
    }
}

export default Net;
