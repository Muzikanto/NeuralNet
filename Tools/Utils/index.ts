const readline = require('readline');

class Utils {
    static print(str: string) {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(str);
    }

    static async sleep(time: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, time)
        });
    }
}

export default Utils;
