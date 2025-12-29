import { Global, Module } from '@nestjs/common';

import { HelperService } from './helpers.service.js';

// This module is used to export a global collection of utility methods
// Please create a new service and add it to providers and exports
//   if the method is not within the scope of any current utility services
@Global()
@Module({
  providers: [HelperService],
  exports: [HelperService],
})
export class UtilsModule {}
