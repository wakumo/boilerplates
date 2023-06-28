import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { SLACK_MESSAGE_QUEUE_NAME } from '../../config/constants.js';
import { notifySlackMessage } from "../utils/slack.js";

@Injectable()
@Processor(SLACK_MESSAGE_QUEUE_NAME)
export class SlackMessageProcessor {

  @Process('new_slack_message')
  async handleNewlThreadMessage(job: Job) {
    if (process.env.NODE_ENV === 'test') return;

    const { msg } = <{ msg: string }>job.data;
    await notifySlackMessage(msg);
    console.log("Successfully notified slack");

    return true;
  }
}