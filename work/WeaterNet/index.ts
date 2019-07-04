import WeaterNet from "./WeaterNet";
import * as trainData from './data-train/data.json'

async function testWeatherNet() {
    const net = new WeaterNet();

    // await net.train(trainData, {log: true, errorThresh: 0.01, logPeriod: 1000});
    // await net.save();
    await net.load();

    const testData = [4, 2, 0, 1, 4];

    const forecast = net.forecast([...testData], 10).map(el => Math.round(el));
    console.log(forecast);
}

export default testWeatherNet;
