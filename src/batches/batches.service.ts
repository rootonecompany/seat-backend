import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import plugin from 'puppeteer-extra-plugin-stealth';
import { PrismaService } from 'src/utils/prisma.service';

@Injectable()
export class BatchesService {
  private readonly logger = new Logger(BatchesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async interParkScraping() {
    this.logger.debug('interParkScraping now');
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: 4 * 60 * 1000,
      ignoreHTTPSErrors: true,
      dumpio: true,
      args: ['--enable-gpu'],
    });

    const musicalPage = await browser.newPage();

    await musicalPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const concertPage = await browser.newPage();

    await concertPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await Promise.all([
      musicalPage.goto(
        this.configService.get<string>('INTERPARK_MUSICAL_URL'),
        {
          waitUntil: ['domcontentloaded'],
          timeout: 30 * 1000,
        },
      ),
      concertPage.goto(
        this.configService.get<string>('INTERPARK_CONCERT_URL'),
        {
          waitUntil: ['domcontentloaded'],
          timeout: 30 * 1000,
        },
      ),
    ]);

    await this.delay(5000);

    musicalPage.click(
      '.stats-info_statsInfoWrap__zBlSG > .stats-info_statsInfoContents__QX68Z .stats-info_subWrap__ji32u button:nth-child(3)',
    );

    concertPage.click(
      '.stats-info_statsInfoWrap__zBlSG > .stats-info_statsInfoContents__QX68Z .stats-info_subWrap__ji32u button:nth-child(3)',
    );

    await this.delay(5000);

    const musicalRankList = await musicalPage.$$eval(
      '.ranking-list_rankingListSubwrap__NbBnQ .ranking-list_rankingItemWrap__wjk3y',
      (rankItems) => {
        return rankItems.map((item) => {
          const imageContainer = item.querySelector(
            '.ranking-vertical-item_imageWrap__R6lkF',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector(
            '.ranking-vertical-item_rankingGoodsName__m0gOz',
          ).textContent;
          const location = item.querySelector(
            '.ranking-vertical-item_placeName__4sHRS',
          ).textContent;
          const date = item.querySelector(
            '.ranking-vertical-item_dateWrap__uZGMU',
          ).textContent;
          const splittedDate = date.split('~');
          return {
            genre: '뮤지컬',
            type: '뮤지컬',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: '인터파크',
          };
        });
      },
    );

    const musicalRankList2 = await musicalPage.$$eval(
      '.ranking-list-bottom_rankingListWrap__plRek .ranking-list-bottom_rankingListSubwrap__YSsif .ranking-list-bottom_rankingItemWrap__U0SBf',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 2; i++) {
          const imageContainer = rankItems[i].querySelector(
            '.ranking-horizontal-item_imageWrap__owTl6',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            '.ranking-horizontal-item_rankingTicketTitle__omJYh',
          ).textContent;
          const location = rankItems[i].querySelector(
            '.ranking-horizontal-item_placeName__zb9kN',
          ).textContent;
          const date = rankItems[i].querySelector(
            '.ranking-horizontal-item_dateWrap__tRsWh',
          ).textContent;
          const splittedDate = date.split('~');
          tempList.push({
            genre: '뮤지컬',
            type: '뮤지컬',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: '인터파크',
          });
        }
        return tempList;
      },
    );

    const resultMusicalRankList = musicalRankList.concat(musicalRankList2);

    const concertRankList = await concertPage.$$eval(
      '.ranking-list_rankingListSubwrap__NbBnQ .ranking-list_rankingItemWrap__wjk3y',
      (rankItems) => {
        return rankItems.map((item) => {
          const imageContainer = item.querySelector(
            '.ranking-vertical-item_imageWrap__R6lkF',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector(
            '.ranking-vertical-item_rankingGoodsName__m0gOz',
          ).textContent;
          const location = item.querySelector(
            '.ranking-vertical-item_placeName__4sHRS',
          ).textContent;
          const date = item.querySelector(
            '.ranking-vertical-item_dateWrap__uZGMU',
          ).textContent;
          const splittedDate = date.split('~');
          return {
            genre: '콘서트',
            type: '콘서트',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: '인터파크',
          };
        });
      },
    );

    const concertRankList2 = await concertPage.$$eval(
      '.ranking-list-bottom_rankingListWrap__plRek .ranking-list-bottom_rankingListSubwrap__YSsif .ranking-list-bottom_rankingItemWrap__U0SBf',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 2; i++) {
          const imageContainer = rankItems[i].querySelector(
            '.ranking-horizontal-item_imageWrap__owTl6',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            '.ranking-horizontal-item_rankingTicketTitle__omJYh',
          ).textContent;
          const location = rankItems[i].querySelector(
            '.ranking-horizontal-item_placeName__zb9kN',
          ).textContent;
          const date = rankItems[i].querySelector(
            '.ranking-horizontal-item_dateWrap__tRsWh',
          ).textContent;
          const splittedDate = date.split('~');
          tempList.push({
            genre: '콘서트',
            type: '콘서트',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: '인터파크',
          });
        }
        return tempList;
      },
    );

    const resultConcertRankList = concertRankList.concat(concertRankList2);

    console.log({
      resultMusicalRankList,
      resultConcertRankList,
    });

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    const transaction = await this.prisma.$transaction([
      createMusicalRank,
      createConcertRank,
    ]);

    if (transaction) {
      await musicalPage.close();

      await concertPage.close();
    }

    await this.delay(5000);

    await browser.close();

    this.logger.debug('interParkScraping end');
  }

  async yes24Scraping() {
    this.logger.debug('yes24Scraping now');
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: 4 * 60 * 1000,
      ignoreHTTPSErrors: true,
      dumpio: true,
      args: ['--enable-gpu'],
    });

    const musicalPage = await browser.newPage();

    await musicalPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const concertPage = await browser.newPage();

    await concertPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await Promise.all([
      musicalPage.goto(this.configService.get<string>('YES24_MUSICAL_URL'), {
        waitUntil: ['domcontentloaded'],
        timeout: 30 * 1000,
      }),
      concertPage.goto(this.configService.get<string>('YES24_CONCERT_URL'), {
        waitUntil: ['domcontentloaded'],
        timeout: 30 * 1000,
      }),
    ]);

    await this.delay(5000);

    musicalPage.click(
      '.rank-cate .rank-cate-cate .rank-cate-tit a:nth-child(2)',
    );

    concertPage.click(
      '.rank-cate .rank-cate-cate .rank-cate-tit a:nth-child(2)',
    );

    await this.delay(5000);

    const musicalRankList = await musicalPage.$$eval(
      '.rank-best div a',
      (rankItems) => {
        return rankItems.map((item) => {
          const imageContainer = item.querySelector('.rank-best-img');
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector('.rlb-tit').textContent;
          const location =
            item.querySelector('.rlb-sub-tit').childNodes[2].textContent;
          const date =
            item.querySelector('.rlb-sub-tit').childNodes[0].textContent;
          const splittedDate = date.split('~');
          return {
            genre: '뮤지컬',
            type: '뮤지컬',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: 'yes24',
          };
        });
      },
    );

    const musicalRankList2 = await musicalPage.$$eval(
      '.rank-list > div',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 2; i++) {
          const imageContainer =
            rankItems[i].querySelector('div:nth-child(2) a');
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'div:nth-child(3) .rank-list-tit',
          ).textContent;
          const location = rankItems[i]
            .querySelector('div:nth-child(4)')
            .textContent.substring(21);
          const date = rankItems[i]
            .querySelector('div:nth-child(4)')
            .textContent.substring(0, 21);
          const splittedDate = date.split('~');
          tempList.push({
            genre: '뮤지컬',
            type: '뮤지컬',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: 'yes24',
          });
        }
        return tempList;
      },
    );

    const resultMusicalRankList = musicalRankList.concat(musicalRankList2);

    const concertRankList = await concertPage.$$eval(
      '.rank-best div a',
      (rankItems) => {
        return rankItems.map((item) => {
          const imageContainer = item.querySelector('.rank-best-img');
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector('.rlb-tit').textContent;
          const location =
            item.querySelector('.rlb-sub-tit').childNodes[2].textContent;
          const date =
            item.querySelector('.rlb-sub-tit').childNodes[0].textContent;
          const splittedDate = date.split('~');
          return {
            genre: '콘서트',
            type: '콘서트',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: 'yes24',
          };
        });
      },
    );

    const concertRankList2 = await concertPage.$$eval(
      '.rank-list > div',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 2; i++) {
          const imageContainer =
            rankItems[i].querySelector('div:nth-child(2) a');
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'div:nth-child(3) .rank-list-tit',
          ).textContent;
          const location = rankItems[i]
            .querySelector('div:nth-child(4)')
            .textContent.substring(21);
          const date = rankItems[i]
            .querySelector('div:nth-child(4)')
            .textContent.substring(0, 21);
          const splittedDate = date.split('~');
          tempList.push({
            genre: '콘서트',
            type: '콘서트',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: 'yes24',
          });
        }
        return tempList;
      },
    );

    const resultConcertRankList = concertRankList.concat(concertRankList2);

    console.log({
      resultMusicalRankList,
      resultConcertRankList,
    });

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    const transaction = await this.prisma.$transaction([
      createMusicalRank,
      createConcertRank,
    ]);

    if (transaction) {
      await musicalPage.close();

      await concertPage.close();
    }

    await this.delay(5000);

    await browser.close();

    this.logger.debug('yes24Scraping end');
  }

  async ticketLinkScraping() {
    this.logger.debug('ticketLinkScraping now');
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: 4 * 60 * 1000,
      ignoreHTTPSErrors: true,
      dumpio: true,
      args: ['--enable-gpu'],
    });

    const musicalPage = await browser.newPage();

    await musicalPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const concertPage = await browser.newPage();

    await concertPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await Promise.all([
      musicalPage.goto(
        this.configService.get<string>('TICKETLINK_MUSICAL_URL'),
        {
          waitUntil: ['domcontentloaded'],
          timeout: 30 * 1000,
        },
      ),
      concertPage.goto(
        this.configService.get<string>('TICKETLINK_CONCERT_URL'),
        {
          waitUntil: ['domcontentloaded'],
          timeout: 30 * 1000,
        },
      ),
    ]);

    await this.delay(5000);

    musicalPage.click(
      '.common_section.section_ranking_detail .common_tab.type_capsule .common_tab_area .common_tab_list li:nth-child(1)',
    );

    concertPage.click(
      '.common_section.section_ranking_detail .common_tab.type_capsule .common_tab_area .common_tab_list li:nth-child(3)',
    );

    await this.delay(5000);

    musicalPage.click(
      '.ranking_filter .common_tab.type_dot .common_tab_area .common_tab_list li:nth-child(2)',
    );

    concertPage.click(
      '.ranking_filter .common_tab.type_dot .common_tab_area .common_tab_list li:nth-child(2)',
    );

    await this.delay(5000);

    const musicalRankList = await musicalPage.$$eval(
      '.ranking_product .ranking_product_table tbody tr',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 5; i++) {
          const imageContainer = rankItems[i].querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_imgbox',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_title',
          ).textContent;
          const location = rankItems[i].querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_place',
          ).textContent;
          const date = rankItems[i].querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_period',
          ).textContent;
          const splittedDate = date.split('-');
          tempList.push({
            genre: '뮤지컬',
            type: '뮤지컬',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: '티켓링크',
          });
        }
        return tempList;
      },
    );

    const resultMusicalRankList = musicalRankList;

    const concertRankList = await concertPage.$$eval(
      '.ranking_product .ranking_product_table tbody tr',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 5; i++) {
          const imageContainer = rankItems[i].querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_imgbox',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_title',
          ).textContent;
          const location = rankItems[i].querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_place',
          ).textContent;
          const date = rankItems[i].querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_period',
          ).textContent;
          const splittedDate = date.split('-');
          tempList.push({
            genre: '콘서트',
            type: '콘서트',
            imageUrl,
            title,
            startDate: splittedDate[0],
            endDate: splittedDate[1],
            location,
            distributor: '티켓링크',
          });
        }
        return tempList;
      },
    );

    const resultConcertRankList = concertRankList;

    console.log({
      resultMusicalRankList,
      resultConcertRankList,
    });

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    const transaction = await this.prisma.$transaction([
      createMusicalRank,
      createConcertRank,
    ]);

    if (transaction) {
      await musicalPage.close();

      await concertPage.close();
    }

    await this.delay(5000);

    await browser.close();

    this.logger.debug('ticketLinkScraping end');
  }

  async melonScraping() {
    this.logger.debug('melonScraping now');
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: true,
      protocolTimeout: 4 * 60 * 1000,
      ignoreHTTPSErrors: true,
      dumpio: true,
      args: ['--enable-gpu'],
    });

    const musicalPage = await browser.newPage();

    await musicalPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    const concertPage = await browser.newPage();

    await concertPage.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    await Promise.all([
      musicalPage.goto(this.configService.get<string>('MELON_MUSICAL_URL'), {
        waitUntil: ['domcontentloaded'],
        timeout: 30 * 1000,
      }),
      concertPage.goto(this.configService.get<string>('MELON_CONCERT_URL'), {
        waitUntil: ['domcontentloaded'],
        timeout: 30 * 1000,
      }),
    ]);

    await this.delay(5000);

    musicalPage.click('.control_list .view_type_control button:nth-child(1)');

    concertPage.click('.control_list .view_type_control button:nth-child(1)');

    await this.delay(5000);

    const musicalRankList = await musicalPage.$$eval(
      '.box_ranking_list table tbody tr',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 5; i++) {
          const imageContainer = rankItems[i].querySelector(
            'td:nth-child(1) div div a',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'td:nth-child(1) div .infor_text .show_title',
          ).textContent;
          const location =
            rankItems[i].querySelector('td:nth-child(3)').textContent;
          const date = rankItems[i].querySelector(
            'td:nth-child(2) .show_date',
          ).textContent;
          const splittedDate = date.split('-');
          tempList.push({
            genre: '뮤지컬',
            type: '뮤지컬',
            imageUrl,
            title,
            startDate: splittedDate[0].trim(),
            endDate: splittedDate[1].trim(),
            location,
            distributor: '멜론티켓',
          });
        }
        return tempList;
      },
    );

    const resultMusicalRankList = musicalRankList;

    const concertRankList = await concertPage.$$eval(
      '.box_ranking_list table tbody tr',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 5; i++) {
          const imageContainer = rankItems[i].querySelector(
            'td:nth-child(1) div div a',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'td:nth-child(1) div .infor_text .show_title',
          ).textContent;
          const location =
            rankItems[i].querySelector('td:nth-child(3)').textContent;
          const date = rankItems[i].querySelector(
            'td:nth-child(2) .show_date',
          ).textContent;
          const splittedDate = date.split('-');
          tempList.push({
            genre: '콘서트',
            type: '콘서트',
            imageUrl,
            title,
            startDate: splittedDate[0].trim(),
            endDate: splittedDate[1].trim(),
            location,
            distributor: '멜론티켓',
          });
        }
        return tempList;
      },
    );

    const resultConcertRankList = concertRankList;

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    console.log({
      resultMusicalRankList,
      resultConcertRankList,
    });

    const transaction = await this.prisma.$transaction([
      createMusicalRank,
      createConcertRank,
    ]);

    if (transaction) {
      await musicalPage.close();

      await concertPage.close();
    }

    await this.delay(5000);

    await browser.close();

    this.logger.debug('melonScraping end');
  }

  private delay(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds);
    });
  }

  async addScrapingJob(jobName: string, time: string) {
    await this.interParkScraping();
    await this.yes24Scraping();
    await this.ticketLinkScraping();
    await this.melonScraping();

    const job = new CronJob(`${time}`, async () => {
      this.logger.debug(`time (${time}) for job ${jobName} to run!`);
      await this.interParkScraping();
      await this.yes24Scraping();
      await this.ticketLinkScraping();
      await this.melonScraping();
    });

    this.schedulerRegistry.addCronJob(jobName, job);

    job.start();

    this.logger.debug(`${jobName} job start now : ${new Date().getDate()}`);
  }

  stopScrapingJob(jobName: string) {
    const job = this.schedulerRegistry.getCronJob(jobName);

    job.stop();

    this.logger.debug(`${jobName} job start now : ${job.lastDate()}`);
  }

  getJobs() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDates();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }
}
