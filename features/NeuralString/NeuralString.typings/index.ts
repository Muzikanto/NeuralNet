import {Network} from "synaptic";

export interface INeuralStringSaved {
    network: Network;
    trainData: INeuralStringTrainItem[];
}

export interface INeuralStringItem {
    input: string,
    output?: string
}

export interface INeuralStringTrainItem extends INeuralStringItem {
    id: number;
}