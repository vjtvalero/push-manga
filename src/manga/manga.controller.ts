import { Controller, Get, Param } from '@nestjs/common';
import * as request from 'request';
import * as cheerio from 'cheerio';

@Controller('manga')
export class MangaController {
    baseUrl = 'https://readms.net/manga';

    @Get('/mangas')
    async getMangas() {
        let promise = new Promise((resolve, reject) => {
            let arr = [];
            request(this.baseUrl, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    const mangas = $('.table.table-striped tbody').children('tr');

                    mangas.each((i, e) => {
                        const manga = $(e);
                        const anchor = manga.children('td').eq(0).find('a');
                        const mangaUrl = anchor.attr('href');
                        const mangaName = anchor.text().replace(/\s\s+/g, '');
                        if (mangaUrl) {
                            arr.push({ url: this.baseUrl + mangaUrl, name: mangaName });
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

    @Get('/thumbnail/:url')
    async getThumbnail(@Param('url') url: string) {
        url = decodeURIComponent(url);
        let promise = new Promise((resolve, reject) => {
            let thumbnail = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
            request(url, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    thumbnail = $('#manga-page').attr('src');
                    resolve(thumbnail);
                } else {
                    reject(thumbnail);
                }
            });
        });

        let result = await promise;
        return result;
    }

    @Get('/chapters/:url')
    async getChapters(@Param('url') url: string) {
        let promise = new Promise((resolve, reject) => {
            let arr = [];
            let newUrl = this.baseUrl + '/' + url;
            request(newUrl, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                    const chapters = $('.table.table-striped tbody').children('tr');

                    chapters.each((i, e) => {
                        const chapter = $(e);
                        const anchor = chapter.children('td').find('a');
                        const chapterUrl = anchor.attr('href');
                        const chapterName = anchor.text().replace(/\s\s+/g, '');
                        const released = chapter.children('td').eq(1).text().replace(/\s\s+/g, '');
                        if (chapterUrl) {
                            arr.push({ url: chapterUrl, name: chapterName, released: released });
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
