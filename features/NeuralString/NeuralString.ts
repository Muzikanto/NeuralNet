import NeuralNet from "../../Tools/NeuralNet/NeuralNet";
import Utils from "../../Tools/Utils";

export async function testNeuralNet() {
    const net = new NeuralNet({inputSize: 13});
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
        'Daniyar mudak'
    ]));
    // [ 'Hello World!!', 'Suck my dick!', 'Daniyar pidor' ]
}
