import {Layer, Network} from "synaptic";
import {ITrainData, ITrainOpts} from "./ImageNet.typings";

class ImageNet {
    protected perceptron: Network = this.createPerceptron();
    protected size: { width: number, height: number };

    constructor(size: { width: number, height: number }) {
        this.size = size;
    }

    public train(trainData: ITrainData, options?: ITrainOpts) {
        const config = {
            ...{
                log: false,
                iterations: 100,
                logPeriod: 10,
                callback: () => {
                },
                callbackPeriod: 1,
            },
            ...options,
        };

        for (let i = 0; i < config.iterations; i++) {
            if (config.log && i % config.logPeriod === 0) {
                console.log('Iteration: ' + i);
            }
            for (const trainItem of trainData) {
                this.iteration(trainItem);
            }

            if (i % config.callbackPeriod === 0) {
                config.callback(i);
            }
        }

        config.log && console.log('Finish Train');
    };

    public trainAsync(trainData: ITrainData, options?: ITrainOpts) {
        const config = {
            ...{
                log: false,
                iterations: 100,
                logPeriod: 10,
                callback: () => {},
                callbackPeriod: 1,
            },
            ...options,
        };
        let iteration = 0;

        return new Promise((resolve)=>{
            const interval = setInterval(() => {
                if (config.log && iteration % config.logPeriod === 0) {
                    console.log('Iteration: ' + iteration);
                }
                for (const trainItem of trainData) {
                    this.iteration(trainItem);
                }

                if (iteration % config.callbackPeriod === 0) {
                    config.callback(iteration);
                }

                if (iteration === config.iterations) {
                    clearInterval(interval);
                    resolve();
                }

                iteration++;
            }, 1);
        });
    }

    public run(test: number[]) {
        const result: number[] = [...test];

        for (let index = 0; index < this.size.width * this.size.height; index++) {
            let px = [
                ...this.pixel(test, index, 0, 0),
                ...this.pixel(test, index, -1, -1),
                ...this.pixel(test, index, 0, -1),
                ...this.pixel(test, index, 1, -1),
                ...this.pixel(test, index, -1, 0),
                ...this.pixel(test, index, 1, 0),
                ...this.pixel(test, index, -1, 1),
                ...this.pixel(test, index, 0, 1),
                ...this.pixel(test, index, 1, 1),
            ];

            let [r, g, b] = this.perceptron.activate(px);

            result[index * 4] = r * 255;
            result[index * 4 + 1] = g * 255;
            result[index * 4 + 2] = b * 255;
        }

        return result;
    };

    public load(data: any) {
        this.perceptron = Network.fromJSON(data);
        console.log('Net Loaded!!!');
    }

    public restore(){
        this.perceptron.restore();
    }

    protected iteration({input, output}: { input: number[], output: number[] }) {
        for (let index = 0; index < this.size.width * this.size.height; index += 2) {
            let px = [
                ...this.pixel(input, index, 0, 0),
                ...this.pixel(input, index, -1, -1),
                ...this.pixel(input, index, 0, -1),
                ...this.pixel(input, index, 1, -1),
                ...this.pixel(input, index, -1, 0),
                ...this.pixel(input, index, 1, 0),
                ...this.pixel(input, index, -1, 1),
                ...this.pixel(input, index, 0, 1),
                ...this.pixel(input, index, 1, 1),
            ];

            this.perceptron.activate(px);
            this.perceptron.propagate(.12, this.pixel(output, index, 0, 0));
        }
    };

    protected pixel(data: number[], index: number, ox: number, oy: number): number[] {
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

    protected createPerceptron() {
        const input = new Layer(27);
        const hiddenLayer = new Layer(8);
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
}

export default ImageNet;
