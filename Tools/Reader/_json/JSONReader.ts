import Reader from "../Reader";

class JSONReader extends Reader {
    public read<T>(path: string): T | null {
        const result = super.read(path);

        return result ? JSON.parse(result) : null;
    }

    public write(path: string, data: Object): Promise<boolean> {
        return super.write(path, JSON.stringify(data));
    }
}

export default JSONReader;
