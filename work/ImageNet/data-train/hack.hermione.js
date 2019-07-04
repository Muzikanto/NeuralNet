const fs = require("fs");

it('Download ', function () {
    return this.browser
        .url('https://yandex.ru/images/search?text=машина%20на%20белом%20фоне')
        .scroll(0, 100000)
        .pause(45000)
        .selectorExecute('.serp-item__thumb.justifier__thumb', function (data) {
            return data.map(el => el.src);
        })
        .then(function (data) {
            console.log(`Model car count ${data.length}`);
            fs.writeFile(`data-raw/car.json`, JSON.stringify(data), function (err) {
                if (err) {
                    throw err;
                }
            });
        })
});
