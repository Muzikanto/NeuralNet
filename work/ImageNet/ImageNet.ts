import {Network} from "synaptic";
import * as fs from "fs";
import ImageNetBase from "./ImageNetBase";

class ImageNet extends ImageNetBase {
    protected path = 'dist/net.json';

    public save() {
        const netContent = this.perceptron.toJSON();
        const fileContent = JSON.stringify(netContent, null, 2);
        fs.writeFileSync(this.path, fileContent);
    }

    public load() {
        const fileContent = fs.readFileSync(this.path, {encoding: 'utf8'});
        const netContent = JSON.parse(fileContent);
        this.perceptron = Network.fromJSON(netContent)
    }
}

export default ImageNet;
