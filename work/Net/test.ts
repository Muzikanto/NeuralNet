import Net from ".";

function testCommonNet() {
    const net = new Net();
    net.train([
        {input: [0, 1], output: [1]},
        {input: [1, 0], output: [1]},
        {input: [1, 1], output: [0]},
        {input: [0, 0], output: [0]},
    ], {
        log: false,
        logPeriod: 5000,
    });
    net.save();

    console.log(net.run([0,1]));
}

export default testCommonNet;
