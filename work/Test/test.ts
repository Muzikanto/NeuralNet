import {Architect, Trainer} from "synaptic";

const ascii2bin = (ascii: string): number[] => {
    let bin = "00000000000000000000000000000000000000000000000000000000000000000000000000000000";
    for (let i = 0; i < ascii.length; i++) {
        let code = ascii.charCodeAt(i);
        bin += ('00000000' + code.toString(2)).slice(-8);
    }
    return bin.slice(-10 * 8).split('').reverse().map(el => +el);
};

const valid = (word: string) => {
    for (const arr in $scope.draw) {
        for (const v of arr) {
            if (v == word) {
                return false;
            }
        }
    }

    return true;
};

const $scope: {
    word: string,
    map: { [key: string]: string[] }
    draw: string[][],
} = {
    word: '',
    map: {
        ...['cat', 'dog', 'john'].reduce((acc, el) => ({...acc, [ascii2bin(el).join('')]: [el]}), {}),
    },
    draw: []
};

const hopfield = new Architect.Hopfield(80);
const trainer = new Trainer(hopfield);

const feed = function (word: string) {
    if (!valid(word)) {
        return;
    }

    const input = ascii2bin(word);
    const output = hopfield.feed(input);
    const key: string = output.join('');

    if (key in $scope.map) {
        $scope.map[key].push(word);
    } else {
        const learn = [];
        $scope.map[key] = [word];

        for (const i in $scope.map) {
            learn.push(i.split(''));
        }

        const set: Trainer.TrainingSet = [];
        for (const v of learn)
            set.push({
                input: v.map(el => +el),
                output: v.map(el => +el),
            });

        doTrain(set);
    }

    preview();
};

const doTrain =  (set: Trainer.TrainingSet) => {
    trainer.train(set, {
        iterations: 1000,
        error: .01,
        rate: .05
    });
};

const learn = [ascii2bin("john"), ascii2bin("dog"), ascii2bin("cat")];
const set: Trainer.TrainingSet = [];

for (const p in learn) {
    set.push({
        input: learn[p].map(el => +el),
        output: learn[p].map(el => +el),
    });
}

doTrain(set);

const preview = function () {
    $scope.draw = Object.values($scope.map);
};
preview();

feed('jack');
feed('eva');
feed('dogges');
console.log($scope);
