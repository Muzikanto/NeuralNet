import {IRowInput} from "../work.utils/Normalizer/Normalizer.typings";
import Net from "./Net";

function testObjectsNet() {
    const sampleData: IRowInput[] = [
        {
            "soilhum": 500,
            "airtemp": 32,
            "airhum": '0',
            "water": true,
            "plants": ["tomatoes", "potatoes"],
            "tempSpan": [34, 54]
        },
        {
            "soilhum": 1050,
            "airtemp": 40,
            "airhum": '1',
            "water": true,
            "plants": ["potatoes", "asparagus"],
            "tempSpan": [24, 14]
        },
        {
            "soilhum": 300,
            "airtemp": 100,
            "airhum": '2',
            "water": false,
            "plants": ["asparagus", "tomatoes"],
            "tempSpan": [56, 4]
        },
        {
            "soilhum": 950,
            "airtemp": 103,
            "airhum": '3',
            "water": true,
            "plants": ["asparagus", "asparagus"],
            "tempSpan": [123, 2]
        },
        {
            "soilhum": 1050,
            "airtemp": 8,
            "airhum": '4',
            "water": true,
            "plants": ["tomatoes", "tomatoes"],
            "tempSpan": [67, 12]
        },
        {
            "soilhum": 1050,
            "airtemp": 56,
            "airhum": '5',
            "water": true,
            "plants": ["potatoes", "french fries"],
            "tempSpan": [45.8, 8]
        },
    ];

    const net = new Net();
    net.train(sampleData);

    const testData = {
        "soilhum": 500,
        "airtemp": 30,
        "airhum": '5',
        "water": false,
        "plants": ["potatoes", "french fries"],
        "tempSpan": [8, 45.8]
    };

    console.log(net.run(testData));
}

export default testObjectsNet;
