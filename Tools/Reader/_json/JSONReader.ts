import Reader from "../Reader";

class JSONReader extends Reader {
    public read(path: string) {
        const data = super.read(path);

        return data ? JSON.parse(data) : null;
    }

    public write(path: string, data: Object): Promise<boolean> {
        return super.write(path, JSON.stringify(data));
    }
}

export default JSONReader;
