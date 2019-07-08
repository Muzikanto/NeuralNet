import {Layer, Network} from "synaptic";

function LSTM(inputNeurons: number, hiddenNeurons: number[], outputNeurons: number, options?: {
    peepholes?: Layer.connectionType,
    hiddenToHidden?: boolean,
    outputToHidden?: boolean,
    outputToGates?: boolean,
    inputToOutput?: boolean,
}) {
    const option = {
        peepholes: Layer.connectionType.ALL_TO_ALL,
        hiddenToHidden: false,
        outputToHidden: false,
        outputToGates: false,
        inputToOutput: true,
    };

    let inputLayer = new Layer(inputNeurons);
    let hiddenLayers: Layer[] = [];
    let outputLayer = new Layer(outputNeurons);

    let previous = null;

    for (let i = 0; i < hiddenNeurons.length; i++) {
        let size = hiddenNeurons[i];

        let inputGate = new Layer(size).set({bias: 1});
        let forgetGate = new Layer(size).set({bias: 1});
        let memoryCell = new Layer(size);
        let outputGate = new Layer(size).set({bias: 1});

        hiddenLayers.push(inputGate);
        hiddenLayers.push(forgetGate);
        hiddenLayers.push(memoryCell);
        hiddenLayers.push(outputGate);

        let input = inputLayer.project(memoryCell);
        inputLayer.project(inputGate);
        inputLayer.project(forgetGate);
        inputLayer.project(outputGate);

        let cell: Layer.LayerConnection | null = null;
        if (previous != null) {
            cell = previous.project(memoryCell);
            previous.project(inputGate);
            previous.project(forgetGate);
            previous.project(outputGate);
        }

        let output = memoryCell.project(outputLayer);

        let self = memoryCell.project(memoryCell);

        if (option.hiddenToHidden) {
            memoryCell.project(memoryCell, Layer.connectionType.ALL_TO_ELSE);
        }
        if (option.outputToHidden) {
            outputLayer.project(memoryCell);
        }
        if (option.outputToGates) {
            outputLayer.project(inputGate);
            outputLayer.project(outputGate);
            outputLayer.project(forgetGate);
        }

        memoryCell.project(inputGate, option.peepholes);
        memoryCell.project(forgetGate, option.peepholes);
        memoryCell.project(outputGate, option.peepholes);

        inputGate.gate(input, Layer.gateType.INPUT);
        forgetGate.gate(self, Layer.gateType.ONE_TO_ONE);
        outputGate.gate(output, Layer.gateType.OUTPUT);

        if (cell != null) {
            inputGate.gate(cell, Layer.gateType.INPUT);
        }

        previous = memoryCell;
    }

    if (option.inputToOutput) {
        inputLayer.project(outputLayer);
    }

    return new Network({
        input: inputLayer,
        hidden: hiddenLayers,
        output: outputLayer
    });
}

export default LSTM;
