export type IparseImageMap = number[][];

export type IparseImageData = {
    pixels: IparseImageMap;
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
