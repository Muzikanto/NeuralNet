import * as car from "./data-raw/car.json";
import ParseImage from "../../work/utils/ParseImage/ParseImage";

const fs = require('fs');

const parser = new ParseImage({size: {width: 50, height: 50}, resize: true});

(async () => {
    fs.mkdir(__dirname + '/data-train', () => {
    });

    for (let i = 0; i < 10; i++) {
        const url = car[i];

        try {
            await parser.loadImage(url);
            parser.prepareImage(5);
            const {pixels} = parser.toJson();

            fs.writeFile(__dirname + `/data-train/${i}.json`, JSON.stringify({
                input: pixels.reduce((acc, el) => [...acc, ...el], []).map(el => Number((el / 255).toFixed(4))),
                output: {
                    ['car' + i]: 1
                }
            }, null, 2), () => {
            });
        } catch (e) {
            console.log(e);
        }
    }
})();

