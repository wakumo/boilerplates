import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { SLACK_MESSAGE_QUEUE_NAME } from '../../config/constants.js';
import { HelperService } from "../utils/helpers.service.js";

@Injectable()
@Processor(SLACK_MESSAGE_QUEUE_NAME)
export class SlackMessageProcessor {

  constructor(
    private readonly helper: HelperService
  ) { }

  @Process('new_slack_message')
  async handleNewlThreadMessage(job: Job) {
    if (process.env.NODE_ENV === 'test') return;

    const { msg } = <{ msg: string }>job.data;
    await this.helper.notifySlackMessage(msg);
    console.log("Successfully notified slack");

    return true;
  }
}