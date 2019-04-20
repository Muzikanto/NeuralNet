import NeuralNet from "../../Tools/NeuralNet/NeuralNet";

import * as car from './data-train/car.json';
import * as cat from './data-train/cat.json';
import * as ball from './data-train/ball.json';

export function testNeuralNet() {
    const net = new NeuralNet({});

    net.train([
        {url: car[0], is: 'car'},
        {url: car[1], is: 'car'},
        {url: cat[0], is: 'cat'},
        {url: cat[1], is: 'cat'},
        {url: ball[0], is: 'ball'},
        {url: ball[1], is: 'ball'}
    ]);
}
