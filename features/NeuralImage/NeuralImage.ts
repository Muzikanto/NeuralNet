import NeuralNet from "../../Tools/NeuralNet/_Image/NeuralNet_Image";
import Utils from "../../Tools/Utils";

import * as car from './data-train/car.json';
import * as cat from './data-train/cat.json';
import * as human from './data-train/human.json';
import * as ball from './data-train/ball.json';

export async function testNeuralNet() {
    const net = new NeuralNet({
        inputSize: 2500,
        hiddenLayers: 200,
        size: {width: 50, height: 50},
        log: true,
        netName: 'net-images',
        iterations: 1000,
        gradientStep: 8,
        greyScale: true
    });
    await net.train([
        {input: car[0], output: 'car'},
        {input: cat[0], output: 'cat'},
        {input: human[0], output: 'human'},
        {input: ball[0], output: 'ball'}
    ]);

    await Utils.sleep(1000);

    console.log(await net.run([
        car[2],
        cat[2],
        human[2],
        ball[2]
    ]));
}
