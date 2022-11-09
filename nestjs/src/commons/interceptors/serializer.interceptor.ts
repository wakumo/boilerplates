import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class SerializerInterceptor implements NestInterceptor {
  async intercept<T>(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<any> {
    return next
      .handle()
      .pipe(map((data: any | any[]) => {
        if (!Array.isArray(data)) data = [data];
        return {
          status: true,
          data: data[0],
          meta: data[1],
          code: context.switchToHttp().getResponse().statusCode
        }
      }));
  }
}
