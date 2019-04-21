import NeuralNet from "../../Tools/NeuralNet/_String/NeuralNet_String";
import Utils from "../../Tools/Utils";

export async function testNeuralNet() {
    const net = new NeuralNet({inputSize: 13, hiddenLayers: 13, log: true, netName: 'net_string'});
    await net.train([
        {input: 'Hello World!!'},
        {input: 'Suck my dick!'},
        {input: 'Daniyar pidor', output: 'pidor'},
        {input: 'Привет мир!!!'}
    ]);

    await Utils.sleep(1000);

    console.log(await net.run([
        'Hello Wo ld.!',
        'Suck ru dick',
        'Daniyar mudak',
        'Привет мудак'
    ]));
    // [ 'Hello World!!', 'Suck my dick!', 'Daniyar pidor', 'Привет мир!!!' ]
}
