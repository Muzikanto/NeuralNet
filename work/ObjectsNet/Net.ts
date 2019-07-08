import {Normalizer} from "../work.utils/Normalizer/Normalizer";
import {Architect, Network} from "synaptic";
import {RowInput} from "neural-data-normalizer/src/normalizer";
import {IRowInput} from "../work.utils/Normalizer/Normalizer.typings";
import Net from "../Net";
import INet from "../Net/Net.typings";

class ObjectsNet extends Net{
    protected normalizer = new Normalizer();

    protected prepareTrainData(rawData: any): INet.TrainItem[] {
        const trainData = this.normalizer.normalize(rawData, ["airhum"]);
        const {neurons: {inputLength, outputLength}} = this.normalizer.getConfig();

        this.net = this.createNet(inputLength, inputLength, outputLength);

        return trainData;
    }

    protected prepareTestData(rawData: any): number[] {
        if (!this.net) {
            const {inputLength, outputLength} = this.normalizer.getConfig().neurons;
            this.createNet(inputLength, inputLength, outputLength);
        }

        return this.normalizer.singleNormalize(rawData).input;
    }

    protected runActivations(testData: number[]): any {
        const bites = super.runActivations(testData);

        return this.normalizer.denormalize(bites);
    }
}

export default ObjectsNet;
