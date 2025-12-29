import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger();

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, baseUrl: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const queries = Object.entries(request.query);
      const appendUrl = queries
        .map(([key, value]) => {
          let stringValue: string;
          if (typeof value === 'string') {
            stringValue = value;
          } else if (Array.isArray(value)) {
            stringValue = value
              .map((v) => (typeof v === 'string' ? v : JSON.stringify(v)))
              .join(',');
          } else {
            stringValue = JSON.stringify(value);
          }
          return `${key}=${stringValue}`;
        })
        .join('&');

      this.logger.log(
        `${method} ${
          url + (queries.length ? '?' + appendUrl : '')
        } ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
