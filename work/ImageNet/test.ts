import ImageNet from "./ImageNet";
import ParseImage from "./utils/ParseImage/ParseImage";

async function testImageNet() {
    const size = {width: 600, height: 400};
    const net = new ImageNet(size);
    const parser = new ParseImage({size, resize: true});


    await parser.loadImage('http://www.britishstyle.net/wp-content/uploads/2018/09/image003.png');
    const input = parser.toJson().pixels;
    await parser.prepareImage({});
    const output = parser.toJson().pixels;

    net.train([
        {input, output}
    ], {
        log: true,
        iterations: 100,
    });
    net.save();


    await parser.loadImage('https://s.auto.drom.ru/i24211/pubs/4/53657/2624530.jpg');
    net.load();
    const test = parser.toJson().pixels;
    const result = net.run(test);

    parser.setPixels(result);
    await parser.draw('test.png');
}

export default testImageNet;
