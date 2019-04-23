import * as cheerio from 'cheerio';
import * as request from 'request';

class Scrapper {
    public parseSite(url: string) {
        return new Promise((resolve: ($: (selector: string) => NodeList) => void, reject) => {
            request(url, (err: Error, response: any, body: string) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(cheerio.load(body) as any);
                }
            });
        });
    }
}

export default Scrapper;
