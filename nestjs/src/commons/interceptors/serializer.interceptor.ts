import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PaginationMetadata } from '../interfaces/index.js';

function isPaginationMetadata(data: unknown): data is PaginationMetadata {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    obj.current_page !== undefined &&
    obj.next_page !== undefined &&
    obj.prev_page !== undefined &&
    obj.total_pages !== undefined &&
    obj.total_count !== undefined
  );
}

function isDataWithPaginationMetadata(
  data: unknown,
): data is { data: unknown; meta: PaginationMetadata } {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    obj.data !== undefined &&
    obj.meta !== undefined &&
    isPaginationMetadata(obj.meta)
  );
}

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data: unknown) => {
        let meta: PaginationMetadata | undefined;
        let responseData: unknown = data;
        if (isDataWithPaginationMetadata(data)) {
          ({ data: responseData, meta } = data);
        }
        const response = context
          .switchToHttp()
          .getResponse<{ statusCode: number }>();
        return {
          status: true,
          data: responseData,
          meta,
          code: response.statusCode,
        };
      }),
    );
  }
}
