const fs = require("fs");
const config = require('./config.json');

for (const v of config.train) {
    it('Download ' + v.text, function () {
        return this.browser
            .url('https://yandex.ru/images/search?text=' + v.text)
            .scroll(0, config.hermione.scroll)
            .pause(config.hermione.pause)
            .selectorExecute('.serp-item__thumb.justifier__thumb', function (data) {
                return data.map(el => el.src);
            })
            .then(function (data) {
                console.log(`Model ${v.model} count ${data.length}`);
                fs.writeFile(`data-train/${v.model}.json`, JSON.stringify(data), function (err) {
                    if (err) {
                        throw err;
                    }
                });
            })
    });
};
