import Telegram from "../../Tools/Telegram/Telegram";
import Scrapper from "../../Tools/Scrapper/Scrapper";
import JSONReader from "../../Tools/Reader/_json/JSONReader";

class BotMeganomKino extends Telegram {
    private async getMeganomFilms() {
        const $ = await new Scrapper().parseSite('https://meganomkino.ru');
        const arr = Array.from($('.mp_poster')) as HTMLElement[];

        const films = arr.map((el) => {
            const arrLi = el.children[2].children[0].children as any;
            const pArr = arrLi.map((el: any) => el.children);
            let times = pArr.map((el: any) => el[el.length - 1].children);
            times = times.slice(0, times.length - 1);
            times = times.map((el: any) => el.map((el2: any) => el2.data));

            return {
                name: (el.children[3].children[0].children[0] as any).data,
                times: times.reduce((acc: Array<any>, el: any) => [...acc, ...el], [])
            }
        });

        return films.reduce((acc: any, el: any) => {
            acc[el.name] = el.times.reduce((acc2: any, el2: any) => {
                acc2[el2] = 1;

                return acc2;
            }, {});

            return acc;
        }, {});
    };

    public async checkNewFilms() {
        const currentFilms = await this.getMeganomFilms();
        const reader = new JSONReader({pathToData: 'dist'});
        const dataFilms = reader.read('films.json') || {};

        let message = "Мультиплекс: ";

        for (const key in currentFilms) {
            if (!dataFilms[key]) {
                message += '\n\nНовый фильм: ' + key + '\n' + Object.keys(currentFilms[key]).join('\n ');
            } else {
                let newTime = null;

                for (const time in currentFilms[key]) {
                    if (!dataFilms[key][time]) {
                        if (!newTime) {
                            newTime = `Новые сеансы: ${key} \n${time}`;
                        } else {
                            newTime += `\n${time}`
                        }
                    }
                }

                if (newTime) {
                    message += `\n\n${newTime}`;
                }
            }
        }

        if (message !== "Мультиплекс: ") {
            await this.sendToMe(message);

            await reader.write('films.json', currentFilms);
        }
    };
}

export default () => new BotMeganomKino('870049910:AAHXub_I4U5GS13BtHzzfNmvZmMq03lIaRk');
