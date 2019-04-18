import * as cheerio from 'cheerio';
import * as request from 'request';

class Scrapper {
    public parseSite(url: string) {
        return new Promise((resolve, reject) => {
            request(url, (err: Error, response: any, body: string) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(cheerio.load(body));
                }
            });
        });
    }

    public async getMeganomFilms() {
        const $ = await this.parseSite('https://meganomkino.ru') as (selector: string) => NodeList;
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
    }
}

export default Scrapper;
