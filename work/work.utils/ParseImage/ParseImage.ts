import * as Jimp from 'jimp';
import {IParseImage, IparseImageData, IparseImageFilters, IparseImageFiltersMatrix} from "./ParseImage.typings";
import {resolve} from "path";

class ParseImage {
    protected size = {
        width: 700,
        height: 700
    };
    protected img: IparseImageData = {
        data: [],
        height: 0,
        width: 0,
    };
    protected resize = false;
    protected filters: {
        [key: string]: {
            matrix: number[][],
            resultFunc: (sum: number) => number
        }
    } = {
        sobel: {
            matrix: [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1],
            ],
            resultFunc: (sum: number) => sum > 64 ? 255 : 0,
        },
        temp: {
            matrix: [
                [-1, -2, -3, -3, -3, -3, -3, -3, -3, -2, -1],
                [-2, -4, -6, -6, -6, -6, -6, -6, -6, -4, -2],
                [-3, -6, -9, -9, -9, -9, -9, -9, -9, -6, -3],
                [-3, -6, -9, 0, 9, 18, 9, 0, -9, -6, -3],
                [-3, -6, -9, 9, 27, 45, 27, 9, -9, -6, -3],
                [-3, -6, -9, 18, 45, 72, 45, 18, -9, -6, -3],
                [-3, -6, -9, 9, 27, 45, 27, 9, -9, -6, -3],
                [-3, -6, -9, 0, 9, 18, 9, 0, -9, -6, -3],
                [-3, -6, -9, -9, -9, -9, -9, -9, -9, -6, -3],
                [-2, -4, -6, -6, -6, -6, -6, -6, -6, -4, -2],
                [-1, -2, -3, -3, -3, -3, -3, -3, -3, -2, -1],
            ],
            resultFunc: (sum: number) => sum > 64 ? 255 : 0,
        },
    };

    constructor(props: IParseImage) {
        props.size && (this.size = props.size);
        this.resize = Boolean(props.resize);
    }

    public async loadImage(url: string) {
        this.img.data = [];
        const image = await Jimp.read(url);
        let {width, height} = image.bitmap;

        if (this.resize) {
            image.resize(this.size.width, this.size.height);
            width = this.size.width;
            height = this.size.height;
        }
        this.img.width = width;
        this.img.height = height;

        for (let y = 0; y < this.img.height; y++) {
            for (let x = 0; x < this.img.width; x++) {
                const rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
                this.img.data.push(rgba.r, rgba.g, rgba.b, rgba.a);
            }
        }
    }

    public setData(conf: Partial<IparseImageData & { resize: boolean }>) {
        if (conf.data) {
            this.img.data = conf.data;
        }
        if (conf.width) {
            this.img.width = conf.width;
        }
        if (conf.height) {
            this.img.height = conf.height;
        }
        if (typeof conf.resize !== 'undefined') {
            this.resize = conf.resize;
        }
    }

    public async draw(path: string) {
        const img = await new Promise<Jimp>((resolve) => {
            new Jimp(this.img.width, this.img.height, (err, img) => {
                let buffer = img.bitmap.data;

                for (let i = 0, b = 0; i < this.img.width * this.img.height * 4; i += 4, b += 4) {
                    buffer[b] = this.img.data[i];
                    buffer[b + 1] = this.img.data[i + 1];
                    buffer[b + 2] = this.img.data[i + 2];
                    buffer[b + 3] = this.img.data[i + 3];
                }

                resolve(img);
            });
        });

        img.write(resolve(path));
    }

    public toJson() {
        return {
            width: this.img.width,
            height: this.img.height,
            data: [...this.img.data],
        };
    }

    public prepare(filters: IparseImageFilters[]) {
        for (const filter of filters) {
            if (filter === 'gray') {
                this.grayScale();
            } else {
                this.prepareWithMatrix(filter);
            }
        }
    }

    protected prepareWithMatrix(filter: IparseImageFiltersMatrix) {
        const {matrix, resultFunc} = this.filters[filter];
        const result: number[] = [];

        const centerY = Math.floor(matrix.length / 2);
        const centerX = Math.floor(matrix[0].length / 2);

        for (let i = 0; i < this.img.data.length; i += 4) {
            let sum = 0;
            for (let y = 0; y < matrix.length; y++) {
                for (let x = 0; x < matrix[y].length; x++) {
                    const pos = i + (x - centerX) + ((y - centerY) * this.img.width) * 4;
                    sum += (this.img.data[pos] * (matrix[y][x])) || 0;
                }
            }

            result[i] = result[i + 1] = result[i + 2] = resultFunc(sum);
            result[i + 3] = this.img.data[i + 3];
        }

        this.img.data = result;

    }

    protected grayScale() {
        for (let i = 0; i < this.img.data.length; i += 4) {
            const pix = (this.img.data[i] + this.img.data[i + 1] + this.img.data[i + 2]) / 3;
            this.img.data[i] = this.img.data[i + 1] = this.img.data[i + 2] = Math.floor(pix);
        }
    }
}

export default ParseImage;
