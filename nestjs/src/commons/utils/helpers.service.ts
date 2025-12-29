/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { PaginationMetadata } from "../interfaces/pagination-metadata.interface.js";
import { IncomingWebhook } from '@slack/webhook';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class HelperService {
  private readonly slackWebhook: IncomingWebhook;

  constructor(
    private readonly config: ConfigService
  ) {
    this.slackWebhook = new IncomingWebhook(this.config.get("slack.webhook_url")!);
  }

  generatePaginationMetadata(page: number, per: number, totalCount: number): PaginationMetadata {
    const totalPages = Math.ceil(totalCount / per);
    return {
      current_page: page,
      next_page: page >= totalPages ? null : page + 1,
      prev_page: page === 1 ? null : page - 1,
      total_pages: totalPages,
      total_count: totalCount,
    };
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  delay(fn: Function, ms: number): Promise<any> {
    return new Promise((resolve) => setTimeout(_ => resolve(fn()), ms));
  }

  async retry(fn: Function, maxAttempts = 3, delayInSeconds = 1): Promise<any> {
    const execute = async (attempt: number) => {
      try {
        return await fn()
      } catch (err) {
        if (attempt <= maxAttempts) {
          const nextAttempt = attempt + 1
          console.error(`Retrying after ${delayInSeconds} seconds due to:`, err)
          return this.delay(() => execute(nextAttempt), delayInSeconds * 1000)
        } else {
          throw err
        }
      }
    }
    return execute(1);
  }


  // Spilit an array to multi chunk arrays
  //
  // chunkArray(100, 980, 100)
  //
  // [
  //     [100, 200],
  //     [200, 300],
  //     [300, 400],
  //     [400, 500],
  //     [500, 600],
  //     [600, 700],
  //     [700, 800],
  //     [800, 900],
  //     [900, 980]
  // ]
  chunkArray(from: number, to: number, chunkSize: number): number[][] {
    let results: number[][] = [];
    let current = from;
    while (current <= to) {
      if (current > to) break;
      results.push([current, Math.min(current + chunkSize, to)]);
      current += chunkSize;
    }
    return results;
  }

  // split a big array into smaller arrays of fixed size
  // e.g splitArray([1,2,3,4,5,6,7,8,9,10], 3)
  // => [[1,2,3], [4,5,6], [7,8,9], [10]]
  splitArray(array: any[], size: number) {
    return Array(Math.ceil(array.length / size)).fill(null)
      .map((_, index) => index * size)
      .map(begin => array.slice(begin, begin + size));
  }

  async notifySlackMessage(msg: string) {
    try {
      await this.slackWebhook.send({
        username: `nestjs-boilerplate`,
        attachments: [
          {
            color: 'good',
            text: msg,
            mrkdwn_in: ["text"]
          }
        ]
      })
    } catch (ex) {
      console.log(ex);
    }
  }
}
