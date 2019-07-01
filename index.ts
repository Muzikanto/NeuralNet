// import * as data from "./data/WeaterNet/weather.json";
import WeaterNet from "./work/WeaterNet/WeaterNet";

// const temp = data.list.map((el: any) => (el.main.temp));
const temp = [
    -15, -12, -11, -5,
    -3, -2, -2, -1,
    0, 1, -1, -2,
    1, 0, 2, 4,
    5, 7, 6, 9,
    11, 12, 13, 16,
    13, 11, 12, 15,
    10, 12, 14, 15
];

(async () => {
    const net = new WeaterNet();

    await net.train(temp, true);
    // await net.load();

    const test = [5, 7, 6];
    const netResult: any = await net.run(test);
    const keys = Object.keys(netResult);
    const result = Number(keys.reduce((acc, key) => netResult[key] > netResult[acc] ? key : acc, keys[0]));

    console.log(test);
    console.log(result);
})();
