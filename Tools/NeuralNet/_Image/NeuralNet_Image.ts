import Base from "../NeuralNet";
import ParseImage from "../../ParseImage/ParseImage";
import {INeuralNetImageProps} from "./NeuralNet_Image.typings";

class NeuralNet extends Base {
    protected imgParser: ParseImage;
    protected gradientStep = 5;

    constructor(props: INeuralNetImageProps) {
        super(props);

        this.imgParser = new ParseImage({size: props.size, greyScale: props.greyScale});
        props.gradientStep && (this.gradientStep = props.gradientStep);
    }


    protected async prepareItem(url: string) {
        await this.imgParser.loadImage(url);
        await this.imgParser.prepareImage(this.gradientStep);

        return this.imgParser.toJSON().reduce((acc, el) => [...acc, ...el.map(v => v / 500)], []);
    }
}

export default NeuralNet;
