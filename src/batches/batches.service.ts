import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Browser, executablePath } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import plugin from 'puppeteer-extra-plugin-stealth';
import { PrismaService } from 'src/utils/prisma.service';
import { CronJob } from 'cron';

@Injectable()
export class BatchesService {
  private readonly logger = new Logger(BatchesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    // this.addCronJob();
  }

  async interParkScraping() {
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath(),
    });

    const musicalPage = await browser.newPage();
    musicalPage.setViewport({
      width: 1920,
      height: 1080,
    });
    musicalPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    const concertPage = await browser.newPage();
    concertPage.setViewport({
      width: 1920,
      height: 1080,
    });
    concertPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    await Promise.all([
      musicalPage.goto(
        this.configService.get<string>('INTERPARK_MUSICAL_URL'),
        {
          waitUntil: ['networkidle0'],
        },
      ),
      concertPage.goto(
        this.configService.get<string>('INTERPARK_CONCERT_URL'),
        {
          waitUntil: ['networkidle0'],
        },
      ),
    ]);

    await this.delay(5000);

    musicalPage.click('menu.stats-info_subWrap__ji32u button[name="주간"]');

    concertPage.click('menu.stats-info_subWrap__ji32u button[name="주간"]');

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
          const startDate = splittedDate[0].trim();
          const endDate = splittedDate[1].trim();
          return {
            genre: 'musical',
            type: 'musical',
            imageUrl,
            title,
            startDate,
            endDate,
            location,
            distributor: 'interpark',
          };
        });
      },
    );

    const musicalRankList2 = await musicalPage.$$eval(
      '.ranking-list-bottom_rankingListWrap__plRek .ranking-list-bottom_rankingListSubwrap__YSsif .ranking-list-bottom_rankingItemWrap__U0SBf',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 7; i++) {
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
          const startDate = splittedDate[0].trim();
          const endDate = splittedDate[1].trim();
          tempList.push({
            genre: 'musical',
            type: 'musical',
            imageUrl,
            title,
            startDate,
            endDate,
            location,
            distributor: 'interpark',
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
          const startDate = splittedDate[0].trim();
          const endDate = splittedDate[1].trim();
          return {
            genre: 'concert',
            type: 'concert',
            imageUrl,
            title,
            startDate,
            endDate,
            location,
            distributor: 'interpark',
          };
        });
      },
    );

    const concertRankList2 = await concertPage.$$eval(
      '.ranking-list-bottom_rankingListWrap__plRek .ranking-list-bottom_rankingListSubwrap__YSsif .ranking-list-bottom_rankingItemWrap__U0SBf',
      (rankItems) => {
        const tempList = [];
        for (let i = 0; i < 7; i++) {
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
          const startDate = splittedDate[0].trim();
          const endDate = splittedDate[1].trim();
          tempList.push({
            genre: 'concert',
            type: 'concert',
            imageUrl,
            title,
            startDate,
            endDate,
            location,
            distributor: 'interpark',
          });
        }
        return tempList;
      },
    );

    const resultConcertRankList = concertRankList.concat(concertRankList2);

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    await this.prisma.$transaction([createMusicalRank, createConcertRank]);

    await this.delay(10000);

    await browser.close();
  }

  async yes24Scraping() {
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath(),
    });

    const musicalPage = await browser.newPage();
    musicalPage.setViewport({
      width: 1920,
      height: 1080,
    });
    musicalPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    const concertPage = await browser.newPage();
    concertPage.setViewport({
      width: 1920,
      height: 1080,
    });
    concertPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    await Promise.all([
      musicalPage.goto(this.configService.get<string>('YES24_MUSICAL_URL'), {
        waitUntil: ['networkidle0'],
      }),
      concertPage.goto(this.configService.get<string>('YES24_CONCERT_URL'), {
        waitUntil: ['networkidle0'],
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
          const startDate = splittedDate[0].trim();
          const endDate = splittedDate[1].trim();
          return {
            genre: 'musical',
            type: 'musical',
            imageUrl,
            title,
            startDate,
            endDate,
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
        for (let i = 0; i < 7; i++) {
          const imageContainer =
            rankItems[i].querySelector('div:nth-child(2) a');
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'div:nth-child(3) .rank-list-tit',
          ).textContent;
          const location = rankItems[i]
            .querySelector('div:nth-child(4) p')
            .textContent.substring(21);
          const date = rankItems[i]
            .querySelector('div:nth-child(4) p')
            .textContent.substring(0, 21);
          const splittedDate = date.split('~');
          // const startDate = splittedDate[0].trim();
          // const endDate = splittedDate[1].trim();
          tempList.push({
            genre: 'musical',
            type: 'musical',
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
          const startDate = splittedDate[0].trim();
          const endDate = splittedDate[1].trim();
          return {
            genre: 'concert',
            type: 'concert',
            imageUrl,
            title,
            startDate,
            endDate,
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
        for (let i = 0; i < 7; i++) {
          const imageContainer =
            rankItems[i].querySelector('div:nth-child(2) a');
          const imageUrl = imageContainer.querySelector('img').src;
          const title = rankItems[i].querySelector(
            'div:nth-child(3) .rank-list-tit',
          ).textContent;
          const location = rankItems[i]
            .querySelector('div:nth-child(4) p')
            .textContent.substring(21);
          const date = rankItems[i]
            .querySelector('div:nth-child(4) p')
            .textContent.substring(0, 21);
          const splittedDate = date.split('~');
          // const startDate = splittedDate[0].trim();
          // const endDate = splittedDate[1].trim();
          tempList.push({
            genre: 'concert',
            type: 'concert',
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

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    await this.prisma.$transaction([createMusicalRank, createConcertRank]);

    await this.delay(10000);

    await browser.close();
  }

  async ticketLinkScraping() {
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath(),
    });

    const musicalPage = await browser.newPage();
    musicalPage.setViewport({
      width: 1920,
      height: 1080,
    });
    musicalPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    const concertPage = await browser.newPage();
    concertPage.setViewport({
      width: 1920,
      height: 1080,
    });
    concertPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    await Promise.all([
      musicalPage.goto(
        this.configService.get<string>('TICKETLINK_MUSICAL_URL'),
        {
          waitUntil: ['networkidle0'],
        },
      ),
      concertPage.goto(
        this.configService.get<string>('TICKETLINK_CONCERT_URL'),
        {
          waitUntil: ['networkidle0'],
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
        return rankItems.map((item) => {
          const imageContainer = item.querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_imgbox',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_title',
          ).textContent;
          const location = item.querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_place',
          ).textContent;
          const date = item.querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_period',
          ).textContent;
          const splittedDate = date.split('-');
          // const startDate = splittedDate[0].trim();
          // const endDate = splittedDate[1].trim();
          return {
            genre: 'musical',
            type: 'musical',
            imageUrl,
            title,
            startDate: splittedDate[0].trim(),
            endDate: splittedDate[1].trim(),
            location,
            distributor: 'ticketlink',
          };
        });
      },
    );

    const resultMusicalRankList = musicalRankList;

    const concertRankList = await concertPage.$$eval(
      '.ranking_product .ranking_product_table tbody tr',
      (rankItems) => {
        return rankItems.map((item) => {
          const imageContainer = item.querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_imgbox',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector(
            'td:nth-child(2) .ranking_product_info .ranking_product_link .ranking_product_title',
          ).textContent;
          const location = item.querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_place',
          ).textContent;
          const date = item.querySelector(
            'td:nth-child(3) .ranking_product_sideinfo .ranking_product_period',
          ).textContent;
          const splittedDate = date.split('-');
          // const startDate = splittedDate[0].trim();
          // const endDate = splittedDate[1].trim();
          return {
            genre: 'concert',
            type: 'concert',
            imageUrl,
            title,
            startDate: splittedDate[0].trim(),
            endDate: splittedDate[1].trim(),
            location,
            distributor: 'ticketlink',
          };
        });
      },
    );

    const resultConcertRankList = concertRankList;

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    await this.prisma.$transaction([createMusicalRank, createConcertRank]);

    await this.delay(10000);

    await browser.close();
  }

  async melonScraping() {
    puppeteer.use(plugin());

    const browser: Browser = await puppeteer.launch({
      headless: 'new',
      executablePath: executablePath(),
    });

    const musicalPage = await browser.newPage();
    musicalPage.setViewport({
      width: 1920,
      height: 1080,
    });
    musicalPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    const concertPage = await browser.newPage();
    concertPage.setViewport({
      width: 1920,
      height: 1080,
    });
    concertPage.setDefaultNavigationTimeout(2 * 60 * 1000);

    await Promise.all([
      musicalPage.goto(this.configService.get<string>('MELON_MUSICAL_URL'), {
        waitUntil: ['networkidle0'],
      }),
      concertPage.goto(this.configService.get<string>('MELON_CONCERT_URL'), {
        waitUntil: ['networkidle0'],
      }),
    ]);

    await this.delay(5000);

    musicalPage.click('.control_list .view_type_control button:nth-child(1)');

    concertPage.click('.control_list .view_type_control button:nth-child(1)');

    await this.delay(5000);

    const musicalRankList = await musicalPage.$$eval(
      '.box_ranking_list table tbody tr',
      (rankItems) => {
        return rankItems.map((item) => {
          const imageContainer = item.querySelector(
            'td:nth-child(1) div div a',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector(
            'td:nth-child(1) div .infor_text .show_title',
          ).textContent;
          const location = item.querySelector('td:nth-child(3)').textContent;
          const date = item.querySelector(
            'td:nth-child(2) .show_date',
          ).textContent;
          const splittedDate = date.split('-');
          // const startDate = splittedDate[0].trim();
          // const endDate = splittedDate[1].trim();
          return {
            genre: 'musical',
            type: 'musical',
            imageUrl,
            title,
            startDate: splittedDate[0].trim(),
            endDate: splittedDate[1].trim(),
            location,
            distributor: 'melon',
          };
        });
      },
    );

    const resultMusicalRankList = musicalRankList;

    const concertRankList = await concertPage.$$eval(
      '.box_ranking_list table tbody tr',
      (rankItems) => {
        return rankItems.map((item) => {
          const imageContainer = item.querySelector(
            'td:nth-child(1) div div a',
          );
          const imageUrl = imageContainer.querySelector('img').src;
          const title = item.querySelector(
            'td:nth-child(1) div .infor_text .show_title',
          ).textContent;
          const location = item.querySelector('td:nth-child(3)').textContent;
          const date = item.querySelector(
            'td:nth-child(2) .show_date',
          ).textContent;
          const splittedDate = date.split('-');
          // const startDate = splittedDate[0].trim();
          // const endDate = splittedDate[1].trim();
          return {
            genre: 'musical',
            type: 'musical',
            imageUrl,
            title,
            startDate: splittedDate[0].trim(),
            endDate: splittedDate[1].trim(),
            location,
            distributor: 'melon',
          };
        });
      },
    );

    const resultConcertRankList = concertRankList;

    const createMusicalRank = this.prisma.performanceRank.createMany({
      data: resultMusicalRankList,
    });

    const createConcertRank = this.prisma.performanceRank.createMany({
      data: resultConcertRankList,
    });

    await this.prisma.$transaction([createMusicalRank, createConcertRank]);

    await this.delay(10000);

    await browser.close();
  }

  private delay(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, seconds);
    });
  }

  // addCronJob() {
  //   const name = 'cronSample';

  //   const job = new CronJob('* * * * * *', () => {
  //     this.logger.warn(`run! ${name}`);
  //   });

  //   this.schedulerRegistry.addCronJob(name, job);

  //   this.logger.warn(`job ${name} added!!`);
  // }

  /**
   *
   *  * * * * * *
      | | | | | |
      | | | | | day of week
      | | | | months
      | | | day of month
      | | hours
      | minutes
      seconds (optional)
  */
  // @Cron('*/10 * * * * *', { name: 'cronTask' })
  // private handleCron() {
  //   this.logger.error('cronTask Called!');
  // }

  // @Interval('intervalTask', 3000)
  // private handleInterval() {
  //   this.logger.log('intervalTask Called!');
  // }

  // @Timeout('timeout', 3000)
  // private handleTimeout() {
  //   this.logger.log('timeoutTask Called!');
  // }
}
