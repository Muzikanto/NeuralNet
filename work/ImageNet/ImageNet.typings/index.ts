export type ITrainData = Array<{ input: number[], output: number[] }>;

export interface ITrainOpts {
    log?: boolean,
    iterations?: number,
    logPeriod?: number,
    callback?: (iteration: number) => void
    callbackPeriod?: number;
}
