import {Layer, Network} from "synaptic";
import {ITestData, ITrainData, ITrainOpts, ITrainOptsRaw} from "./ImageNet.typings";

class ImageNet {
    protected perceptron: Network;
    protected size: { width: number, height: number };
    protected matrix: number[][];
    protected matrixSizes: {
        size: number,
        center: number,
    };

    constructor(size: { width: number, height: number }) {
        this.size = size;
        this.matrix = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ];
        this.matrixSizes = {
            size: this.matrix.length,
            center: Math.floor(this.matrix.length / 2),
        };
        this.perceptron = this.createPerceptron();
    }

    public train(trainData: ITrainData, options?: ITrainOptsRaw) {
        const config = this.prepareTrainConfig(options);

        for (let iteration = 0; iteration < config.iterations; iteration++) {
            this.singleTrain(trainData, iteration, config);
        }

        const doneTime = new Date().getTime() - config.startTime;
        this.print('\nTime: ' + (doneTime / 1000).toFixed(2) + 's' + '\n');
    };

    public run({data, width, height}: ITestData) {
        const result: number[] = [...data];
        const _pixel = this.getPixel.bind({size: {width, height}});
        let done = 0;
        const startTime = new Date();

        for (let index = 0; index < width * height; index++) {
            let px: number[] = [];
            for (let y = 0; y < this.matrixSizes.size; y++) {
                for (let x = 0; x < this.matrixSizes.size; x++) {
                    if (this.matrix[y][x]) {
                        px.push.apply(px, _pixel(data, index, y - this.matrixSizes.center, x - this.matrixSizes.center));
                    }
                }
            }

            let [r, g, b] = this.perceptron.activate(px);

            result[index * 4] = r * 255;
            result[index * 4 + 1] = g * 255;
            result[index * 4 + 2] = b * 255;

            let nextDone = Math.floor(index * 100 / (width * height));
            if (nextDone !== done) {
                this.print('Done: ' + done + '%', true);
                done = nextDone;
            }
        }

        const doneTime = new Date().getTime() - startTime.getTime();
        this.print('\nTime: ' + (doneTime / 1000).toFixed(2) + 's' + '\n');

        return result;
    };

    public load(data: any) {
        this.perceptron = Network.fromJSON(data);
        console.log('Net Loaded!!!');
    }

    public restore() {
        this.perceptron.reset();
        this.perceptron.restore();
    }

    protected prepareTrainConfig(options?: ITrainOptsRaw): ITrainOpts {
        return {
            ...{
                log: false,
                iterations: 100,
                logPeriod: 10,
                callback: () => {
                },
                callbackPeriod: 1,
                startTime: new Date().getTime(),
            },
            ...options,
        };
    }

    protected createPerceptron() {
        let neurons = 0;

        for (let i = 0; i < this.matrixSizes.size; i++) {
            for (let j = 0; j < this.matrixSizes.size; j++) {
                if (this.matrix[i][j]) {
                    neurons++
                }
            }
        }

        console.log('Neurons: ' + (neurons * 3));

        const input = new Layer(neurons * 3);
        const hiddenLayer = new Layer(neurons);
        const output = new Layer(3);

        const hidden = [hiddenLayer];

        input.project(hiddenLayer);
        input.project(output);

        return new Network({
            input,
            hidden,
            output,
        });
    }

    protected singleTrain(trainItem: ITrainData, iteration: number, config: ITrainOpts) {
        this.iteration(trainItem);

        if (config.log && iteration % config.logPeriod === 0) {
            const one = (new Date().getTime() - config.startTime) / (iteration + 1);
            const timeWait = (config.iterations * one - (iteration + 1) * one) / 1000;
            this.print('Iteration: ' + (iteration + 1) + ' wait ' + timeWait.toFixed(2) + 's', true);
        }
        if (iteration % config.callbackPeriod === 0) {
            config.callback(iteration);
        }
    }

    protected getPixel(data: number[], index: number, ox: number, oy: number): number[] {
        let y = index / this.size.width | 0;
        let x = index % this.size.width;

        if (ox && (x + ox) > 0 && (x + ox) < this.size.width) {
            x += ox;
        }
        if (oy && (y + oy) > 0 && (y + oy) < this.size.height) {
            y += oy;
        }

        let red = data[((this.size.width * y) + x) * 4];
        let green = data[((this.size.width * y) + x) * 4 + 1];
        let blue = data[((this.size.width * y) + x) * 4 + 2];

        return [red / 255, green / 255, blue / 255];
    };

    protected iteration({input, output}: { input: number[], output: number[] }) {
        for (let index = 0; index < this.size.width * this.size.height; index += 2) {
            let px: number[] = [];

            for (let y = 0; y < this.matrixSizes.size; y++) {
                for (let x = 0; x < this.matrixSizes.size; x++) {
                    if (this.matrix[y][x]) {
                        px.push.apply(px, this.getPixel(input, index, y - this.matrixSizes.center, x - this.matrixSizes.center));
                    }
                }
            }

            this.perceptron.activate(px);
            this.perceptron.propagate(.12, this.getPixel(output, index, 0, 0));
        }
    };

    protected print(message: string, singleLine?: boolean) {
        console.log(message);
    }

    // public trainAsync(trainData: ITrainData, options?: ITrainOptsRaw) {
    //     const config = this.prepareTrainConfig(options);
    //     let iteration = 0;
    //
    //     return new Promise((resolve) => {
    //         const interval = setInterval(() => {
    //             this.singleTrain(trainData, iteration, config);
    //
    //             if (iteration === config.iterations) {
    //                 clearInterval(interval);
    //                 resolve();
    //             }
    //
    //             iteration++;
    //         }, 1);
    //     });
    // }
}

export default ImageNet;
