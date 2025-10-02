import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    req['startTime'] = Date.now();
    const { method, query, body, originalUrl, ip } = req;

    let logRequest = `Started ${method} "${originalUrl}" for ${ip}`;
    if (query && Object.keys(query).length > 0) logRequest += `\n  query: ${JSON.stringify(query)}`;
    if (body && Object.keys(body).length > 0) logRequest += `\n  body: ${JSON.stringify(body)}`;
    this.logger.log(logRequest);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - req['startTime'];

      if (statusCode >= 400) {
        this.logger.error(`Completed ${statusCode} in ${duration}ms\n\n`);
      } else {
        this.logger.log(`Completed ${statusCode} in ${duration}ms\n\n`);
      }
    });

    next();
  }
}
