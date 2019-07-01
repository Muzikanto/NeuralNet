import * as Jimp from 'jimp';
import {IParseImage, IparseImageData} from "./ParseImage.typings";
import {resolve} from "path";

class ParseImage {
    protected size = {width: 700, height: 700};
    protected data: IparseImageData = {
        pixels: [],
        height: 0,
        width: 0
    };
    protected resize = false;

    constructor(props: IParseImage) {
        props.size && (this.size = props.size);
        this.resize = Boolean(props.resize);
    }

    public async loadImage(url: string) {
        const image = await Jimp.read(url);
        let {width, height} = image.bitmap;

        if (this.resize) {
            image.resize(this.size.width, this.size.height);
            width = this.size.width;
            height = this.size.height;
        }
        this.data.width = width;
        this.data.height = height;

        for (let i = 0; i < this.data.width; i++) {
            this.data.pixels[i] = [];
            for (let j = 0; j < this.data.height; j++) {
                this.data.pixels[i][j] = Jimp.intToRGBA(image.getPixelColor(i, j)).r;
            }
        }
    }

    public prepareImage(gradientStep: number) {
        this.prepare(gradientStep);
        this.prepare2();
    }

    public async draw(path: string) {
        const img = await new Promise<Jimp>((resolve) => {
            new Jimp(this.data.width, this.data.height, (err, img) => {
                let buffer = img.bitmap.data;

                for (let x = 0; x < this.data.width; x++) {
                    for (let y = 0; y < this.data.height; y++) {
                        const offset = (y * this.data.width + x) * 4;
                        let pix = this.data.pixels[x][y];

                        buffer[offset] = pix;
                        buffer[offset + 1] = pix;
                        buffer[offset + 2] = pix;
                        buffer[offset + 3] = 255;
                    }
                }

                resolve(img);
            });
        });

        img.write(resolve(path));
    }

    public toJson() {
        return this.data;
    }

    private prepare(gradientStep: number) {
        for (let x = 1; x < this.data.width - 1; x++) {
            for (let y = 1; y < this.data.height - 1; y++) {
                const current = this.data.pixels[x][y];

                const right = this.data.pixels[x + 1][y];
                const up = this.data.pixels[x][y + 1];
                const left = this.data.pixels[x - 1][y];
                const bottom = this.data.pixels[x][y + 1];
                const rightUp = this.data.pixels[x + 1][y - 1];
                const leftUp = this.data.pixels[x - 1][y - 1];
                const rightBottom = this.data.pixels[x + 1][y + 1];
                const leftBottom = this.data.pixels[x - 1][y + 1];

                if ([up, left, right, bottom, rightUp, leftBottom, rightBottom, leftUp]
                    .filter((v) => Math.abs(current - v) > gradientStep).length < 6)
                    this.data.pixels[x][y] = 0;
            }
        }
    }

    private prepare2() {
        for (let x = 1; x < this.data.width - 1; x++) {
            for (let y = 1; y < this.data.height - 1; y++) {
                const right = this.data.pixels[x + 1][y];
                const up = this.data.pixels[x][y + 1];
                const left = this.data.pixels[x - 1][y];
                const bottom = this.data.pixels[x][y + 1];
                const rightUp = this.data.pixels[x + 1][y - 1];
                const leftUp = this.data.pixels[x - 1][y - 1];
                const rightBottom = this.data.pixels[x + 1][y + 1];
                const leftBottom = this.data.pixels[x - 1][y + 1];

                if ([up, left, right, bottom, rightUp, leftBottom, rightBottom, leftUp]
                    .filter((v) => v === 0).length > 5) {
                    this.data.pixels[x][y] = 0;
                }
            }
        }
    }

}

export default ParseImage;
