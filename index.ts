import Scrapper from "./Scrapper/Scrapper";
import Telegram from "./Telegram/Telegram";
import Reader from "./Reader/Reader";

(async () => {
    const bot = new Telegram('870049910:AAHXub_I4U5GS13BtHzzfNmvZmMq03lIaRk');
    const currentFilms = await new Scrapper().getMeganomFilms();
    const reader = new Reader({});

    const dataFilms = reader.readJSON('films.json');

    if (dataFilms) {
        for (const key in currentFilms) {
            if (!dataFilms[key]) {
                bot.sendToMe('Новый фильм: ' + key + '\n' + Object.keys(currentFilms[key]).join(' | '));
            } else {
                for (const time in currentFilms[key]) {
                    if (!dataFilms[key][time]) {
                        bot.sendToMe('Новый сеанс: ' + key + '\n' + time);
                    }
                }
            }
        }
    }

    await reader.writeJSON('films.json', currentFilms);
})();
