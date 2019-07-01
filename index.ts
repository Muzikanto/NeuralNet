// import * as data from "./data/WeaterNet/weather.json";
import WeaterNet from "./work/WeaterNet/WeaterNet";

// const temp = data.list.map((el: any) => (el.main.temp));
const temp = [
    240, 245, 250, 255, // 1 похожий порядок
    234, 243, 252, 251,
    241, 245, 252, 255, // 2 похожий порядок
    232, 260, 260, 232,
    241, 243, 252,      // выведет 255
];

(async () => {
    const net = new WeaterNet();

    await net.train(temp, true);
    // await net.load();

    const test = temp.slice(-3);
    const netResult: any = await net.run(test);
    const keys = Object.keys(netResult);
    const result = Number(keys.reduce((acc, key) => netResult[key] > netResult[acc] ? key : acc, keys[0]));

    console.log(temp.slice(-3));
    console.log(result);
})();
