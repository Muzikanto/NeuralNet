const readline = require('readline');

class Utils {
    protected consolePrint(str: string) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(str);
    }

    public async sleep(time: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, time)
        });
    }
}

export default Utils;
