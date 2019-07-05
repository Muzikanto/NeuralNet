export type IparseImageData = {
    data: number[];
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

export type IparseImageFiltersMatrix = 'sobel' | 'temp';
export type IparseImageFilters = IparseImageFiltersMatrix | 'gray';
