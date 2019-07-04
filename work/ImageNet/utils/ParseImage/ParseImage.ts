import * as Jimp from 'jimp';
import {IParseImage, IparseImageData} from "./ParseImage.typings";
import {resolve} from "path";

class ParseImage {
    protected size = {
        width: 700,
        height: 700
    };
    protected data: IparseImageData = {
        pixels: [],
        height: 0,
        width: 0,
    };
    protected resize = false;
    protected baseMatrix = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1],
    ];

    constructor(props: IParseImage) {
        props.size && (this.size = props.size);
        this.resize = Boolean(props.resize);
    }

    public async loadImage(url: string) {
        this.data.pixels = [];
        const image = await Jimp.read(url);
        let {width, height} = image.bitmap;

        if (this.resize) {
            image.resize(this.size.width, this.size.height);
            width = this.size.width;
            height = this.size.height;
        }
        this.data.width = width;
        this.data.height = height;

        for (let y = 0; y < this.data.height; y++) {
            for (let x = 0; x < this.data.width; x++) {
                const rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
                this.data.pixels.push(rgba.r, rgba.g, rgba.b, rgba.a);
            }
        }
    }

    public setPixels(pixels: number[]) {
        this.data.pixels = pixels;
    }

    public async draw(path: string) {
        const img = await new Promise<Jimp>((resolve) => {
            new Jimp(this.data.width, this.data.height, (err, img) => {
                let buffer = img.bitmap.data;

                for (let i = 0, b = 0; i < this.data.width * this.data.height * 4; i += 4, b += 4) {
                    buffer[b] = this.data.pixels[i];
                    buffer[b + 1] = this.data.pixels[i + 1];
                    buffer[b + 2] = this.data.pixels[i + 2];
                    buffer[b + 3] = this.data.pixels[i + 3];
                }

                resolve(img);
            });
        });

        img.write(resolve(path));
    }

    public toJson() {
        return {
            width: this.data.width,
            height: this.data.height,
            pixels: [...this.data.pixels],
        };
    }

    public prepareImage(options: {
        threshold?: number,
        matrix?: number[][],
        revertBlack?: boolean,
        grayScale?: boolean,
        filter?: boolean,
    }) {
        const {
            matrix,
            threshold,
            revertColor,
            grayScale,
            filter,
        } = {
            ...{
                threshold: 64,
                matrix: this.baseMatrix,
                revertColor: false,
                grayScale: true,
                filter: true,
            },
            ...options,
        };
        const result = [];

        if (grayScale) {
            for (let i = 0; i < this.data.pixels.length; i += 4) {
                const pix = (this.data.pixels[i] + this.data.pixels[i + 1] + this.data.pixels[i + 2]) / 3;
                this.data.pixels[i] = this.data.pixels[i + 1] = this.data.pixels[i + 2] = Math.floor(pix);
            }
        }

        if (filter) {
            const centerY = Math.floor(matrix.length / 2);
            const centerX = Math.floor(matrix[0].length / 2);

            const colors = revertColor ? [0, 255] : [255, 0];

            for (let i = 0; i < this.data.pixels.length; i += 4) {
                let sum = 0;
                for (let y = 0; y < matrix.length; y++) {
                    for (let x = 0; x < matrix[y].length; x++) {
                        const pos = i + (x - centerX) + ((y - centerY) * this.data.width) * 4;
                        sum += this.data.pixels[pos] * (matrix[y][x]) || 0;
                    }
                }
                result[i] = result[i + 1] = result[i + 2] = sum >= threshold ? colors[0] : colors[1];
                result[i + 3] = this.data.pixels[i + 3];
            }

            this.data.pixels = result;
        }
    }
}

export default ParseImage;
