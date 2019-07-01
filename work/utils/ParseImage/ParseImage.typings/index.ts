export type IparseImageData = {
    pixels: number[][];
    width: number;
    height: number;
};

export interface IParseImage {
    size?: {
        width: number;
        height: number;
    };
    resize?: boolean;
}
