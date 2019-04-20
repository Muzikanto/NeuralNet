import Telegram from "../../Tools/Telegram/Telegram";
import Scrapper from "../../Tools/Scrapper/Scrapper";
import JSONReader from "../../Tools/Reader/_json/JSONReader";
import {IObject} from "../../typings/global";

export async function leastenFilms() {
    const bot = new Telegram('870049910:AAHXub_I4U5GS13BtHzzfNmvZmMq03lIaRk');
    const currentFilms = await new Scrapper().getMeganomFilms();
    const reader = new JSONReader({pathToData: 'test'});

    const dataFilms = reader.read<IObject>('films.json') || {};


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
        await bot.sendToMe(message);
    }

    await reader.write('films.json', currentFilms);
}
