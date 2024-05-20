function isPaginationMetadata(data: any): data is PaginationMetadata {
  return data.current_page !== undefined &&
    data.next_page !== undefined &&
    data.prev_page !== undefined &&
    data.total_pages !== undefined &&
    data.total_count !== undefined;
}

function isDataWithPaginationMetadata(data: any) {
  return data && data.data && isPaginationMetadata(data.meta);
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { PaginationMetadata } from "../interfaces";

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  async intercept<T>(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    return next
      .handle()
      .pipe(map((data: any) => {
        let meta: PaginationMetadata;
        if (isDataWithPaginationMetadata(data)) { ({ data, meta } = data); }
        return {
          status: true,
          data, meta,
          code: context.switchToHttp().getResponse().statusCode
        }
      }));
  }
}
