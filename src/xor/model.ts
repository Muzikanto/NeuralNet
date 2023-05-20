import { Layer, Network, Trainer } from 'synaptic';
import * as fs from 'fs';
import * as path from 'path';

const pathToModel = path.join(__dirname, 'data.json');

export class XORModel {
  protected network!: Network;

  public train(data: Array<{ input: number[]; output: number[] }>, opts: Trainer.TrainingOptions = {}): void {
    const trainer = new Trainer(this.network);
    trainer.train(data, {
      rate: 0.1,
      iterations: 20000,
      error: 0.005,
      shuffle: true,
      log: 1000,
      cost: Trainer.cost.CROSS_ENTROPY,
      ...opts,
    });
  }

  public activate(data: number[][]): number[][] {
    return data.map((el) => this.network.activate(el));
  }

  public init(): void {
    if (this.load()) {
      return;
    }

    const inputLayer = new Layer(2);
    const hiddenLayer = new Layer(2);
    const outputLayer = new Layer(1);

    inputLayer.project(hiddenLayer);
    hiddenLayer.project(outputLayer);

    this.network = new Network({ input: inputLayer, hidden: [hiddenLayer], output: outputLayer });
  }

  public toJSON(): object {
    return this.network.toJSON();
  }

  public load(): boolean {
    if (fs.existsSync(pathToModel)) {
      this.network = Network.fromJSON(JSON.parse(fs.readFileSync(pathToModel, { encoding: 'utf-8' })));

      return true;
    }

    return false;
  }

  public save(): void {
    fs.writeFileSync(pathToModel, JSON.stringify(this.toJSON(), null, 2), { encoding: 'utf-8' });
  }
}
