import Net from "../NeuralNet";

class WeaterNet extends Net {
    private count = 3;

    protected prepareTrainData(rawData: number[]) {
        const trainData: any[] = [];
        const {min, max} = rawData.reduce((acc, el) => ({
            min: el < acc.min ? el : acc.min,
            max: el > acc.max ? el : acc.max
        }), {max: 0, min: 273});

        const arr = rawData.map(this.prepareItem.bind({max, min}));

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

    protected prepareItem(this: { max: number, min: number }, v: number) {
        return v / 273
    }

    private dataToObj(arr: any) {
        return arr.reduce((acc: any, el: number, i: number) => ({
            ...acc,
            [i]: el,
        }), {});
    }
}

export default WeaterNet;
