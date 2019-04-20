import * as brain from "brain.js";
import {INeuralNetworkJSON, INeuralNetworkTrainingOptions} from "brain.js";
import JSONReader from "../Reader/_json/JSONReader";
import {INeuralNet} from "./NeuralNet.typings";
import ParseImage from "../ParseImage/ParseImage";

class NeuralNet {
    protected api = new brain.NeuralNetwork();
    protected reader = new JSONReader({pathToData: 'test'});
    protected trainOptions: INeuralNetworkTrainingOptions = {
        iterations: 1,
        log: true,
        logPeriod: 1
    };

    constructor(props: INeuralNet) {
        props.trainOptions && (this.trainOptions = props.trainOptions);
        props.pathToData && (this.reader.pathToData = props.pathToData);
    }

    public async train(urls: { url: string, is: string }[]) {
        const data = [];

        for(const v of urls) {
            data.push({input: await this.loadImage(v.url), output: v.is})
        }


        this.api.train(data, this.trainOptions);
        this.reader.write('net.json', this.api.toJSON());
    }

    public async run(url: string | string[]) {
        const net = this.reader.read('net.json') as INeuralNetworkJSON;

        if (!net) {
            throw new Error('Not Found file');
        }
        this.api.fromJSON(net);

        return typeof url === 'string' ?
            this.api.run(await this.loadImage(url)) :
            url.map(async el => this.api.run(await this.loadImage(el)));
    }

    protected async loadImage(url: string) {
        const imgParser = new ParseImage({resize: true});
        await imgParser.loadImage(url);
        imgParser.prepareImage(8);

        return imgParser.toJSON();
    }
}

export default NeuralNet;
