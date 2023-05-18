import * as dotenv from 'dotenv'
dotenv.config();

import { ColumnOptions } from "typeorm";

export const SECONDS = 1;
export const MILLISECONDS_TO_SECONDS = 1e-3;
export const SECONDS_TO_MILLISECONDS = 1000;

export const MINUTES = 60 * SECONDS;
export const MINUTES_MS = 60 * SECONDS_TO_MILLISECONDS;

export const HOURS = 60 * MINUTES;
export const HOURS_MS = 60 * MINUTES_MS;

export const DAYS = 24 * HOURS;
export const DAYS_MS = 24 * HOURS_MS;

export const TOKEN_EXPIRE_TIME = 7 * DAYS;

export const RABBIT_MQ_TIMEOUT_MS = 1 * MINUTES_MS;

export function DECIMAL(precision: number, scale: number): ColumnOptions {
  return {
    precision, scale,
    type: 'decimal',
    default: 0.0
  }
};
