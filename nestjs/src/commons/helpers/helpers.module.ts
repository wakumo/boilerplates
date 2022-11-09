import { Global, Module } from "@nestjs/common";
import { HelperService } from "./helpers.service.js";

@Global()
@Module({
  providers: [HelperService],
  exports: [HelperService]
})
export class HelperModule { }