import {Network} from "synaptic";
import * as fs from "fs";
import ImageNetBase from "./ImageNetBase";

class ImageNetApp extends ImageNetBase {
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

    protected print(message: string, singleLine?: boolean) {
        if (singleLine) {
            // @ts-ignore
            process.stdout.clearLine();
            // @ts-ignore
            process.stdout.cursorTo(0);
        }

        process.stdout.write(message);
    }
}

export default ImageNetApp;
