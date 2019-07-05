import ImageNetApp from "./ImageNetApp";
import ParseImage from "./utils/ParseImage/ParseImage";
import * as cars from './data-train/data-raw/car.json'


async function testImageNet() {
    const size = {width: 600, height: 400};
    const net = new ImageNetApp(size);
    const parser = new ParseImage({size, resize: true});


    await parser.loadImage(cars[0]);
    const input = parser.toJson().data;

    parser.prepare(['gray', 'sobel']);
    await parser.draw('img_output.png');
    const output = parser.toJson().data;

    const trainData = [{input, output}];
    net.train(trainData, {
        log: true,
        logPeriod: 1,
        iterations: 30,
    });
    net.save();


    parser.setData({resize: true});
    await parser.loadImage(cars[0]);
    const test = parser.toJson();

    net.load();
    const result = net.run(test);

    parser.setData({data: result});
    await parser.draw('img_result.png');
}

export default testImageNet;
