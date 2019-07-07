import ImageNetApp from "./ImageNetApp";
import ParseImage from "./utils/ParseImage/ParseImage";

async function testImageNet() {
    const size = {width: 600, height: 400};
    const net = new ImageNetApp(size);
    const parser = new ParseImage({size, resize: true});

    // human temp filter http://veritas.by/wp-content/uploads/2017/04/czeloviek-dumajet-e1515162846608.jpg
    await parser.loadImage('http://veritas.by/wp-content/uploads/2017/04/czeloviek-dumajet-e1515162846608.jpg');
    const input = parser.toJson().data;

    parser.prepare(['gray', 'sobel']);
    await parser.draw('img_output.png');
    const output = parser.toJson().data;

    net.train({input, output}, {
        log: true,
        logPeriod: 1,
        iterations: 30,
    });
    net.save();


    parser.setData({resize: true});
    await parser.loadImage('https://avatars.mds.yandex.net/get-pdb/38069/9fe2dd95-556d-4fb0-bc26-dd9a53cf94ae/s1200?webp=false');
    const test = parser.toJson();

    net.load();
    const result = net.run(test);

    parser.setData({data: result});
    await parser.draw('img_result.png');
}

export default testImageNet;
