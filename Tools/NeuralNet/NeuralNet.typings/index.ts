import {INeuralNetworkTrainingOptions} from "brain.js";

export interface INeuralNet {
    pathToData?: string;
    inputSize?: number;
    hiddenLayers?: number;
    iterations?: number;
    learningRate?: number;
}