import Net from "../Net";
import {Normalizer} from "../work.utils/Normalizer/Normalizer";
import INet from "../Net/Net.typings";
import LSTM from "../work.utils/LSTM/LSTM";
import {Network} from "synaptic";
import {IRowInput} from "../work.utils/Normalizer/Normalizer.typings";
import * as fs from "fs";

class PredictNet extends Net {
    protected normalizer: Normalizer = new Normalizer();
    protected metaFilePath = `dist/${this.fileName}_meta.json`;

    public save() {
        super.save();
        const fileContent = JSON.stringify(this.normalizer.getConfig(), null, 2);
        fs.writeFileSync(this.metaFilePath, fileContent);
    }

    public load() {
        super.load();
        const fileContent = fs.readFileSync(this.metaFilePath, {encoding: 'utf8'});
        const netContent = JSON.parse(fileContent);
        this.normalizer.setConfig(netContent);
    }

    protected createNet(inputNeurons: number, hiddenNeurons: number, outputNeurons: number): Network {
        return LSTM(1, [4, 4, 4], 1)
    }

    protected prepareTrainData(rawData: any): INet.TrainItem[] {
        const trainData = this.normalizer.normalize(rawData, ['output']);

        return trainData;
    }

    protected prepareTestData(rawData: IRowInput[]): number[][] {
        const testData = rawData.map(el => this.normalizer.singleNormalize(el).input);

        return testData;
    }

    protected runActivations(bites: number[][], predictCount: number = 1): number[] {
        const arr: number[] = [];
        const firstSize = bites.length;
        let currentPredict = 1;

        for (let i = 0; i < bites.length; i++) {
            const bits = this.net.activate(bites[i]);
            const result = Math.round(this.normalizer.denormalize(bits).output as number);

            arr.push(result);
            if (i + 1 >= firstSize && currentPredict <= predictCount) {
                bites.push(this.normalizer.singleNormalize({input: result}).input);
                currentPredict++;
            }
        }

        return arr;
    }
}

export default PredictNet;
