export type IRowInput = {
    [prop: string]: string | number | Array<string | number> | boolean;
};

export interface IMetaData {
    [key: string]: IItem;
}

export type ITypes = 'number' | 'boolean' | 'array_string' | 'array_number' | 'string';

export type IItem = {
    type: 'number';
    min: number;
    max: number;
} | {
    type: 'boolean';
} | {
    type: 'array_string';
    count: number;
    distinctValues: string[];
} | {
    type: 'array_number';
    min: number;
    max: number;
    count: number;
    distinctValues: number[]
} | {
    type: 'string';
    distinctValues: string[];
};

export interface IProperties {
    metadata: IMetaData,
    outputProperties: string[],
    neurons: { inputLength: number, outputLength: number }
}
