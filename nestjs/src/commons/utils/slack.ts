
import 'dotenv/config';
import { IncomingWebhook } from '@slack/webhook';

const url = process.env.SLACK_NOTIFICATION_URL;
const webhook = new IncomingWebhook(url);

export async function notifySlackMessage(msg: string) {
  try {
    await webhook.send({
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