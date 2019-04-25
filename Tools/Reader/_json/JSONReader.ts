import Reader from "../Reader";

class JSONReader extends Reader {
    public read(path: string) {
        let data = super.read(path);

        if (data && data.length > 1 && data[0] !== '{' && data[0] !== '[') {
            data = data.slice(1);
        }

        return data ? JSON.parse(data) : null;
    }

    public write(path: string, data: Object): Promise<boolean> {
        return super.write(path, JSON.stringify(data));
    }
}

export default JSONReader;
