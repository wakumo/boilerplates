import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

import { JwtConfig } from './config.js';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    @Inject(JwtConfig.KEY)
    private readonly jwtConfig: ConfigType<typeof JwtConfig>,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return { secret: this.jwtConfig.secret };
  }
}
