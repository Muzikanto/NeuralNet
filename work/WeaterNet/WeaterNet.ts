import Net from "../NeuralNet";

class WeaterNet extends Net {
    private count = 3;

    protected prepareTrainData(rawData: number[]) {
        const trainData: any[] = [];
        const arr = rawData.map(this.prepareItem);

        for (let i = this.count; i < rawData.length; i++) {
            trainData.push({
                input: this.dataToObj(arr.slice(i - this.count, i)),
                output: {[rawData[i]]: 1}
            })
        }

        return trainData;
    }

    protected prepareTestData(rawData: number[]): any {
        return this.dataToObj(super.prepareTestData(rawData));
    }

    protected prepareItem(v: number) {
        return v / 273;
    }

    private dataToObj(arr: any) {
        return arr.reduce((acc: any, el: number, i: number) => ({
            ...acc,
            [i]: el,
        }), {});
    }
}

export default WeaterNet;
