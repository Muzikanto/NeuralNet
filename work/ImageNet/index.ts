import ImageNet from "./ImageNetBase";

const size = {width: 600, height: 400};
const net = new ImageNet(size);

const canvas = document.getElementById('result') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const btnStart = document.getElementById('start_train') as HTMLButtonElement;
const textIterations = document.getElementById('iterations') as HTMLSpanElement;
const inputUrl = document.getElementById('input_url') as HTMLInputElement;
const dropGray = document.getElementById('drop_gray') as HTMLInputElement;
const inputImage = document.getElementById('input') as HTMLImageElement;
const testImage  = document.getElementById('test') as HTMLImageElement;
const outputImage  = document.getElementById('output') as HTMLImageElement;

const input: number[] = Array.from(getData(inputImage).data);
let test: number[] = Array.from(getData(testImage).data);
const output: number[] = Array.from(getData(outputImage).data);

btnStart.onclick = runTrain;
inputUrl.onchange = (e: any) => {
    net.restore();
    testImage.src = e.target.value;
    test = Array.from(getData(testImage).data);
};


function runTrain() {
    net.trainAsync([
        {input, output}
    ], {
        log: false,
        logPeriod: 1,
        iterations: 20,
        callbackPeriod: 1,
        callback: drawResult
    }).then()
}

function drawResult(iteration: number) {
    const checked = dropGray.checked;
    const result = net.run(test);

    const imgData = ctx.getImageData(0, 0, size.width, size.height);
    for (let i = 0; i < imgData.data.length; i++) {
        if (checked) {
            imgData.data[i] = result[i] > 60 ? 255 : 0;
        } else {
            imgData.data[i] = result[i];
        }
    }

    textIterations.innerHTML = 'Iteration: ' + iteration;
    ctx.putImageData(imgData, 0, 0);
}

function getData(img: HTMLImageElement) {
    const _canvas = document.createElement('canvas');
    _canvas.width = size.width;
    _canvas.height = size.height;

    const _ctx = _canvas.getContext('2d') as CanvasRenderingContext2D;

    _ctx.drawImage(img, 0, 0);

    return _ctx.getImageData(0, 0, size.width, size.height);
}
