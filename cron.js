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
                        const mangaTitle = anchor.clone().children().remove().end().text().trim().replace(/\s\s+/g, '');
                        const chapterNumber = anchor.find('strong').text().replace(/\s\s+/g, '');
                        const chapterTitle = anchor.find('em').text().replace(/\s\s+/g, '');
                        const releaseDate = anchor.children().eq(0).text().replace(/\s\s+/g, '');
                        if (mangaUrl) {
                            arr.push({ url: baseUrl + mangaUrl, mangaTitle, chapterNumber, chapterTitle, releaseDate });
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

    async getMangas() {
        let promise = new Promise((resolve, reject) => {
            let arr = [];
            request(this.baseMangaUrl, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    const mangas = $('.table.table-striped tbody').children('tr');

                    mangas.each((i, e) => {
                        const manga = $(e);
                        const anchor = manga.children('td').eq(0).find('a');
                        const mangaUrl = anchor.attr('href');
                        const mangaTitle = anchor.text().replace(/\s\s+/g, '');
                        if (mangaUrl) {
                            arr.push({ url: this.baseMangaUrl + mangaUrl, name: mangaTitle });
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

// get latest chapters
mangaCron.getLatest().then((res) => {

    axios.post(`https://viayensii.website/push-manga/update.php`, res)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => console.error(error));

}).catch(error => console.error(error));

// get all manga titles
mangaCron.getMangas().then((res) => {

    axios.post(`https://viayensii.website/push-manga/update-mangas.php`, res)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => console.error(error));

}).catch(error => console.error(error));