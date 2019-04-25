import fs = require("fs");
import {resolve} from "path";
import {IReader} from "./Reader.typings";

class Reader {
    public pathToData = resolve('dist');

    constructor(props: IReader) {
        props.pathToData && (this.pathToData = resolve(props.pathToData));
    }

    public write(path: string, data: string): Promise<boolean> {
        const pathToFile = resolve(this.pathToData, path);

        return new Promise((resolve) => {
            fs.writeFile(pathToFile, data, (err: Error) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public read(path: string): string | null {
        const pathToFile = resolve(this.pathToData, path);

        if (!fs.existsSync(pathToFile)) {
            return null;
        } else {
            return fs.readFileSync(pathToFile, 'utf8');
        }
    }

    protected createFolder(path: string): Promise<boolean> {
        const pathToFolder = resolve(this.pathToData, path);

        return new Promise((resolve) => {
            if (!fs.existsSync(path)) {
                fs.mkdir(pathToFolder, (err: Error) => {
                    resolve(!err);
                });
            }
        })
    }
}

export default Reader;
