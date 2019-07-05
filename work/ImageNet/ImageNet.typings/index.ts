export interface ITrainData {
    input: number[],
    output: number[]
};

export interface ITrainOpts {
    log: boolean,
    iterations: number,
    logPeriod: number,
    callback: (iteration: number) => void
    callbackPeriod: number;
    startTime: number;
}

export interface ITrainOptsRaw {
    log?: boolean,
    iterations?: number,
    logPeriod?: number,
    callback?: (iteration: number) => void
    callbackPeriod?: number;
}

export interface ITestData {
    data: number[],
    width: number,
    height: number,
}
