import {IItem, IMetaData, IProperties, IRowInput, ITypes} from "./Normalizer.typings";
import {RowInput} from "neural-data-normalizer/src/normalizer";

export class Normalizer {
    protected datasetMeta: IMetaData = {};
    protected outputProperties: string[] = [];
    protected neurons: { inputLength: number, outputLength: number } = {inputLength: 2, outputLength: 1};

    public normalize(dataset: Array<IRowInput> = [], outputProperties: string[]): Array<{input: number[], output: number[]}> {
        const trainData: Array<{input: number[], output: number[]}> = [];

        if (!Array.isArray(dataset)) {
            throw new Error('\x1b[37m\x1b[44mNormalizer input data should be an array of rows: [{...}, {...}]\x1b[0m')
        }

        if (dataset.length <= 0) {
            throw new Error(`\x1b[37m\x1b[44mNormalizer input data shouldn't be empty\x1b[0m`);
        }

        if (Object.keys(dataset[0]).length <= 0) {
            throw new Error(`\x1b[37m\x1b[44mNormalizer input data rows has to contain some properties (only 1st row is checked)\x1b[0m`);
        }

        this.datasetMeta = this.analyzeMetaData(dataset);
        this.outputProperties = Object.keys(this.datasetMeta).filter((key: string) => outputProperties.indexOf(key) !== -1);

        for (let i in dataset) {
            const row = dataset[i];

            const {
                input,
                output,
            } = this.singleNormalize(row);

            if (input.length > 0 && output.length > 0) {
                trainData.push({
                    input,
                    output,
                })
            }
        }

        this.neurons = {
            inputLength: trainData[0].input.length,
            outputLength: trainData[0].output.length,
        };

        return trainData;
    }

    public denormalize<OUTPUT extends RowInput>(bites: number[]): OUTPUT {
        const result: RowInput = {};

        let index = 0;
        for (const key of this.outputProperties) {
            const item = this.datasetMeta[key];

            switch (item.type) {
                case 'number':
                    const {min, max} = item;
                    result[key] = (bites[index] * (max - min)) + min;

                    index++;
                    break;
                case 'boolean':
                    result[key] = Boolean(bites[index]);

                    index++;
                    break;
                case "string":
                    if (true) {
                        const {distinctValues} = item;
                        const size = distinctValues.length;
                        const maxID = bites.slice(index, index + size).reduce((max, el, i, arr) => el > arr[max] ? i : max, 0);

                        const denormalizeArr = distinctValues[maxID];

                        result[key] = denormalizeArr;

                        index += size;
                    }
                    break;
                case "array_number":
                    if (true) {
                        const {distinctValues, count} = item;
                        const size = distinctValues.length;
                        const sortedBites = bites
                            .slice(index, index + size)
                            .map((el: number, i: number) => ({el, i}))
                            .sort((a, b) => b.el - a.el);

                        const denormalizeArr: number[] = [];
                        for (let i = 0; i < count; i++) {
                            denormalizeArr.push(distinctValues[sortedBites[i].i])
                        }

                        result[key] = denormalizeArr;

                        index += size;
                    }
                    break;
                case "array_string":
                    if (true) {
                        const {distinctValues, count} = item;
                        const size = distinctValues.length;
                        const sortedBites = bites
                            .slice(index, index + size)
                            .map((el: number, i: number) => ({el, i}))
                            .sort((a, b) => b.el - a.el);

                        const denormalizeArr: string[] = [];
                        for (let i = 0; i < count; i++) {
                            denormalizeArr.push(distinctValues[sortedBites[i].i])
                        }
                        result[key] = denormalizeArr;

                        index += size;
                    }
            }
        }

        return result as OUTPUT;
    }

    public singleNormalize(row: IRowInput): { input: number[], output: number[] } {
        let input: number[] = [];
        let output: number[] = [];

        for (let prop in row) {
            let bitsArr: number[];

            const value: any = row[prop];
            const meta = this.datasetMeta[prop];

            switch (meta.type) {
                case 'number':
                    bitsArr = [this.numToBit(meta.min, meta.max, value)];
                    break;
                case 'boolean':
                    bitsArr = [this.boolToBit(value)];
                    break;
                case 'string':
                    if (meta.distinctValues.indexOf(value) === -1) {
                        throw new Error(`Prop "${prop}" value "${row[prop]}" not exists in distinctValues`)
                    }
                    bitsArr = this.strToBitsArr(meta.distinctValues, value);
                    break;
                default:
                    // any numbers and distinctValues strings
                    if (meta.type === 'array_string') {
                        value.forEach((el: any) => {
                            if (meta.distinctValues.indexOf(el) === -1) {
                                throw new Error(`Prop "${prop}" value "${el}" not exists in distinctValues`)
                            }
                        });
                    }

                    bitsArr = this.arrToBitsArr(meta.distinctValues, value);
                    break;
            }

            if (this.outputProperties.indexOf(prop) > -1) {
                output = output.concat(bitsArr);
            } else {
                input = input.concat(bitsArr);
            }
        }

        return {
            input,
            output,
        }
    }

    public setConfig({metadata, outputProperties, neurons}: IProperties) {
        this.datasetMeta = metadata;
        this.outputProperties = outputProperties;
        this.neurons = neurons;
    }

    public getConfig() {
        return {
            metadata: this.datasetMeta,
            outputProperties: this.outputProperties,
            neurons: this.neurons,
        }
    }

    protected analyzeMetaData(dataset: IRowInput[]): IMetaData {
        const firstRow = dataset[0];
        const distinctProps = this.distinctProps(firstRow);
        const distinctTypes = this.distinctTypes(firstRow) as { [key: string]: any };

        let metadata: { [key: string]: any } = {};

        for (let prop of distinctProps) {
            const type = distinctTypes[prop];
            const item: Partial<IItem> = metadata[prop] = {
                type,
            };

            switch (item.type) {
                case 'number':
                    const minMax = this.getMinMax(prop, dataset);
                    item.min = minMax[0];
                    item.max = minMax[1];
                    break;
                case 'boolean':
                    break;
                case 'string':
                    const distinctStrVals = this.getDistinctVals(prop, dataset) as string[];
                    item.distinctValues = distinctStrVals;
                    break;
                case 'array_number':
                    if (true) {
                        const arrMinMax = this.get2DimArrayMinMax(prop, dataset);
                        const distinctArrVals = this.getDistinctArrayVals(prop, dataset);

                        item.min = arrMinMax[0];
                        item.max = arrMinMax[1];
                        // @ts-ignore
                        item.count = dataset[0][prop].length;
                        item.distinctValues = distinctArrVals;
                    }
                    break;
                case 'array_string':
                    if (true) {
                        const distinctArrVals = this.getDistinctArrayVals(prop, dataset);
                        // @ts-ignore
                        item.count = dataset[0][prop].length;
                        item.distinctValues = distinctArrVals;
                    }
                    break;
            }
        }

        return metadata;
    }

    protected strToBitsArr(distinctValues: string[], val: string) {
        let bitArr = new Array(distinctValues.length);
        bitArr.fill(0);

        for (let i in distinctValues) {
            if (val === distinctValues[i]) {
                bitArr[i] = 1;
            }
        }

        return bitArr;
    }

    protected arrToBitsArr(distinctValues: Array<string | number>, vals: Array<string | number>) {
        let bitArr = new Array(distinctValues.length);
        bitArr.fill(0);

        for (let j in vals) {
            const val = vals[j];
            let idx = distinctValues.indexOf(val);
            bitArr[idx] = 1;
        }

        return bitArr;
    }

    protected getDistinctVals(property: string, data: IRowInput[]) {
        let distinctValues = [];

        for (let row of data) {
            const val = row[property];

            if (distinctValues.indexOf(val) === -1) {
                distinctValues.push(val);
            }
        }

        return distinctValues;
    }

    protected getDistinctArrayVals(property: string, data: IRowInput[]) {
        let distinctValues = [];

        for (let row of data) {
            const arrVal: any = row[property];

            for (let val of arrVal) {
                if (distinctValues.indexOf(val) === -1) {
                    distinctValues.push(val);
                }
            }
        }

        return distinctValues;
    }

    protected getMinMax(key: string, data: IRowInput[]) {
        let min: number | null = null;
        let max: number | null = null;

        for (let i in data) {
            let val: any = data[i][key];

            if (min === null || val < min) {
                min = val
            }
            if (max === null || val > max) {
                max = val
            }
        }

        return [min || 0, max || 0]
    }

    protected getFlatArrMinMax(arr: Array<any>) {
        let min: number | null = null;
        let max: number | null = null;

        if (typeof arr[0] === 'string') {
            return [min, max];
        }

        for (let i in arr) {
            if (typeof arr[i] !== 'number') {
                continue;
            }
            let val: number = parseFloat(arr[i]);

            if (min === null || val < min) {
                min = val;
            }
            if (max === null || val > max) {
                max = val;
            }
        }

        return [min || 0, max || 0];
    }

    protected get2DimArrayMinMax(prop: string, data: any) {
        let min: number | null = null;
        let max: number | null = null;

        let mins: Array<number | null> = [];
        let maxs: Array<number | null> = [];

        for (let row of data) {
            const arr = row[prop]; // this is itself a 1 dim array

            let minMax = this.getFlatArrMinMax(arr);

            mins.push(minMax[0]);
            maxs.push(minMax[1]);
        }

        min = this.getFlatArrMinMax(mins)[0];
        max = this.getFlatArrMinMax(maxs)[1];

        return [min || 0, max || 0]
    }

    protected numToBit(min: number, max: number, value: number): number {
        if (max - min === 0) {
            return 1;
        }

        const num = (value - min) / (max - min);
        return Number((num).toFixed(6));
    }

    protected boolToBit(val: boolean) {
        return +val;
    }

    protected distinctProps(row: IRowInput) {
        return Object.keys(row);
    }

    protected distinctTypes(row: IRowInput): { [key: string]: ITypes } {
        let distinctTypes: { [key: string]: ITypes } = {};

        for (let prop in row) {
            const value = row[prop];

            if (typeof value === 'object' && Array.isArray(value)) {
                distinctTypes[prop] = 'array' + '_' + typeof value[0] as ITypes;
            } else {
                distinctTypes[prop] = typeof (value) as ITypes;
            }
        }

        return distinctTypes;
    }
}
