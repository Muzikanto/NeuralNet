import Base from "../NeuralNet";

class NeuralNet extends Base {
    protected async prepareItem(str: string) {
        if (str.length > this.inputSize) {
            throw new Error(`Over input layer size: ${str}`);
        }

        const parsed = str.split('').map(ch => ch.charCodeAt(0) / Math.pow(2, 8));
        const fill = new Array(parsed.length < this.inputSize ? this.inputSize - parsed.length : 0)
            .fill(0)
            .map(el => Math.floor(Math.random()));

        return [...parsed, ...fill];
    }
}

export default NeuralNet;
