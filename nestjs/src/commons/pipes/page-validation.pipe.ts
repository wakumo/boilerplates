import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { MAX_PER_PAGE } from '../../config/constants.js';

@Injectable()
export class PageValidationPipe implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    const page = Number.parseInt(value);
    return Number.isNaN(page) || page < 1 ? 1 : page;
  }
}

@Injectable()
export class PerPageValidationPipe implements PipeTransform {
  transform(value: string, _metadata: ArgumentMetadata) {
    const per = Number.parseInt(value);
    if (Number.isNaN(per) || per < 1) {
      return 1;
    }

    if (per > MAX_PER_PAGE) {
      return MAX_PER_PAGE;
    }

    return per;
  }
}
