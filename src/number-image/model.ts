import { Layer, Network, Trainer } from 'synaptic';
import * as fs from 'fs';
import * as path from 'path';

const pathToModel = path.join(__dirname, 'data.json');

export class NumberImageModel {
  protected network!: Network;

  public train(
    data: Array<{ input: number[]; output: number[] }>,
    opts: Trainer.TrainingOptions = {}
  ): Trainer.TrainingResult {
    const trainer = new Trainer(this.network);

    const result = trainer.train(data, {
      rate: 0.1,
      iterations: 1000,
      error: 0.05,
      shuffle: true,
      log: 10,
      cost: Trainer.cost.CROSS_ENTROPY,
      ...opts,
    });

    return result;
  }

  public activate(data: number[]): number[] {
    return this.network.activate(data);
  }

  //

  public init(): void {
    if (this.load()) {
      return;
    }

    const inputLayer = new Layer(784);
    const hiddenLayer = new Layer(20);
    const outputLayer = new Layer(10);

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

  public formatItem(result: number[]): number {
    let index = 0;

    for (let i = 0; i < result.length; i++) {
      if (result[i] > result[index]) {
        index = i;
      }
    }

    return index;
  }
}
