import {Normalizer} from "../work.utils/Normalizer/Normalizer";
import {Architect, Network} from "synaptic";
import {RowInput} from "neural-data-normalizer/src/normalizer";
import {IRowInput} from "../work.utils/Normalizer/Normalizer.typings";

class ObjectsNet {
    protected normalizer = new Normalizer();
    protected net: Network = this.createNet(2, 1);

    public train(rawData: Array<RowInput>) {
        const trainData = this.normalizer.normalize(rawData, ["airhum"]);
        const {neurons: {inputLength, outputLength}} = this.normalizer.getConfig();

        this.createNet(inputLength, outputLength);

        for (let i = 0; i < 10000; i++) {
            for (const v of trainData) {
                this.net.activate(v.input);
                this.net.propagate(0.01, v.output);
            }
        }
    }

    public run(rawData: IRowInput) {
        if (!this.net) {
            const {inputLength, outputLength} = this.normalizer.getConfig().neurons;
            this.createNet(inputLength, outputLength);
        }
        const testData = this.normalizer.singleNormalize(rawData).input;
        const bites = this.net.activate(testData);

        const result = this.normalizer.denormalize(bites);

        return result;
    }

    protected createNet(inputLength: number, outputLength: number) {
        this.net = new Architect.Perceptron(inputLength, inputLength, outputLength);

        return this.net;
    }
}

export default ObjectsNet;
