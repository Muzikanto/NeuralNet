// import {testNeuralNet} from "./features/NeuralString/NeuralString";

// testNeuralNet();

// import createFilmsListneerBot from "./features/Kino/Kino";
//
const bot = createFilmsListneerBot();
bot.addStrictListeners({});
bot.checkNewFilms().then();
