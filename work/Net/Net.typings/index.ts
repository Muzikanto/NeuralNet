namespace INet {
    export interface TrainItem {
        input: number[];
        output: number[];
    }

    export type TrainData = TrainItem[];

    export interface TrainOptions {
        log: boolean,
        iterations: number,
        logPeriod: number,
        callback?: (iteration: number) => void;
        callbackPeriod: number;
        startTime: number;
        rate: number;
    }

    export interface TrainOptionsRaw {
        log?: boolean;
        iterations?: number;
        logPeriod?: number;
        callback?: (iteration: number) => void;
        callbackPeriod?: number;
        rate?: number;
    }
}

export default INet;
