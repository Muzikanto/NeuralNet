import fs = require("fs");
import {join} from "path";
import {IReader} from "./typings";

class Reader {
    protected pathToData = join(__dirname, '..');

    constructor(props: IReader) {
        props.pathToData && (this.pathToData = props.pathToData);
    }

    public write(path: string, data: string): Promise<boolean> {
        const pathToFile = join(this.pathToData, path);

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

    public writeJSON(path: string, data: Object): Promise<boolean> {
        return this.write(path, JSON.stringify(data));
    }

    public read(path: string): string | null {
        const pathToFile = join(this.pathToData, path);

        if (!fs.existsSync(pathToFile)) {
            return null;
        } else {
            return fs.readFileSync(pathToFile, 'utf8');
        }
    }

    public readJSON(path: string): { [key: string]: any } | null {
        const read = this.read(path);

        return read ? JSON.parse(read) : null;
    }

    protected createFolder(path: string): Promise<boolean> {
        const pathToFolder = join(this.pathToData, path);

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