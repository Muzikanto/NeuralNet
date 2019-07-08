import ImageNet from "./ImageNetBase";
import {ITestData} from "./ImageNet.typings";

const size = {width: 600, height: 400};
const net = new ImageNet(size);

const canvas = document.getElementById('result') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const btnStart = document.getElementById('start_train') as HTMLButtonElement;
const textIterations = document.getElementById('iterations') as HTMLSpanElement;
const inputUrl = document.getElementById('input_url') as HTMLInputElement;
const dropGray = document.getElementById('drop_gray') as HTMLInputElement;
const inputImage = document.getElementById('input') as HTMLImageElement;
const testImage = document.getElementById('test') as HTMLImageElement;
const outputImage = document.getElementById('output') as HTMLImageElement;

let input: number[];
let test: ITestData;
let output: number[];

window.onload = () => {
    input = Array.from(getData(inputImage).data);
    test = getData(testImage);
    output = Array.from(getData(outputImage).data);
};

btnStart.onclick = runTrain;
inputUrl.onchange = (e: any) => {
    net.restore();
    testImage.src = e.target.value;
    testImage.setAttribute('crossOrigin', '');

    testImage.onload = () => {
        test = getData(testImage);

        const imgData = ctx.getImageData(0, 0, size.width, size.height);

        for (let i = 0; i < imgData.data.length; i++) {
            imgData.data[i] = test.data[i];
        }

        ctx.putImageData(imgData, 0, 0);
    }
};

function runTrain() {
    net.restore();
    net.trainAsync(
        {input, output}
        , {
            log: false,
            logPeriod: 1,
            iterations: 20,
            callbackPeriod: 1,
            callback: drawResult
        });
}

let max = 64;

function drawResult(iteration: number) {
    const checked = dropGray.checked;
    const result = net.run(test);

    const imgData = ctx.getImageData(0, 0, size.width, size.height);

    for (let i = 0; i < imgData.data.length; i++) {
        if (checked) {
            imgData.data[i] = result[i] > max ? 255 : 0;
        } else {
            imgData.data[i] = result[i];
        }
    }

    const next = result.reduce((acc, el) => acc + el, 0) / result.length;
    if (Math.abs(next - max) > 5) {
        max += next > max ? 5 : -5;
    }

    textIterations.innerHTML = 'Iteration: ' + iteration;
    ctx.putImageData(imgData, 0, 0);
}

function getData(img: HTMLImageElement) {
    const _canvas = document.createElement('canvas');
    _canvas.width = size.width;
    _canvas.height = size.height;

    const _ctx = _canvas.getContext('2d') as CanvasRenderingContext2D;

    _ctx.drawImage(img, 0, 0, size.width, size.height);

    const data = _ctx.getImageData(0, 0, size.width, size.height);

    return {
        width: data.width,
        height: data.height,
        data: Array.from(data.data),
    }
}
