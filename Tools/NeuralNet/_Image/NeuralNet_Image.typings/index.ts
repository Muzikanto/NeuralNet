import {INeuralNetProps} from "../../NeuralNet.typings";

export interface INeuralNetImageProps extends INeuralNetProps{
    size?: {
        width: number;
        height: number;
    };
    gradientStep?: number;
    greyScale?: boolean;
}
