import {INeuralNetworkTrainingOptions} from "brain.js";

export interface INeuralNet {
    pathToData?: string;
    trainOptions?: INeuralNetworkTrainingOptions
}