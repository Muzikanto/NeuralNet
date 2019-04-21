import {Network} from "synaptic";

export interface INeuralNetProps {
    pathToData?: string;
    inputSize?: number;
    hiddenLayers?: number;
    iterations?: number;
    learningRate?: number;
    log?: boolean;
    netName?: string;
}

export interface INeuralSaved {
    network: Network;
    trainData: Array<INeuralTrainItem & INeuralInputItem>;
}

export interface INeuralInputItem {
    input: string,
    output?: string
}

export interface INeuralTrainItem extends INeuralInputItem {
    id: number;
    values: number[];
}
