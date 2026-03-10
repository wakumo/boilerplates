import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { IncomingWebhook } from '@slack/webhook';

import { SlackConfig } from '../../config/config.js';

@Injectable()
export class HelperService {
  private readonly slackWebhook: IncomingWebhook;

  constructor(
    @Inject(SlackConfig.KEY)
    private readonly slackConfig: ConfigType<typeof SlackConfig>,
  ) {
    this.slackWebhook = new IncomingWebhook(this.slackConfig.webhookUrl!);
  }

  async notifySlackMessage(msg: string) {
    try {
      await this.slackWebhook.send({
        username: `nestjs-boilerplate`,
        attachments: [
          {
            color: 'good',
            text: msg,
            mrkdwn_in: ['text'],
          },
        ],
      });
    } catch (ex) {
      console.log(ex);
    }
  }
}
