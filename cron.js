var request = require('request');
var cheerio = require('cheerio');
var axios = require('axios');

var baseUrl = 'https://readms.net';
var baseMangaUrl = 'https://readms.net/manga';

class MangaCron {
    constructor() { }

    async getLatest() {
        let promise = new Promise((resolve, reject) => {
            let arr = [];
            request(baseMangaUrl, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    const mangas = $('.new-list').eq(0).children('li');

                    mangas.each((i, e) => {
                        const manga = $(e);
                        const anchor = manga.find('a');
                        const mangaUrl = anchor.attr('href');
                        const mangaName = anchor.clone().children().remove().end().text().trim().replace(/\s\s+/g, '');
                        const chapterNumber = anchor.find('strong').text().replace(/\s\s+/g, '');
                        const chapterName = anchor.find('em').text().replace(/\s\s+/g, '');
                        const released = anchor.children().eq(0).text().replace(/\s\s+/g, '');
                        if (mangaUrl) {
                            arr.push({ url: baseUrl + mangaUrl, mangaName, chapterNumber, chapterName, released });
                        }
                    });

                    resolve(arr);
                } else {
                    reject(arr);
                }
            });
        });

        let result = await promise;
        return result;
    }
}

let mangaCron = new MangaCron();
mangaCron.getLatest().then((res) => {

    axios.post(`https://viayensii.website/push-manga/update.php`, res)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => console.error(error));

}).catch(error => console.error(error));