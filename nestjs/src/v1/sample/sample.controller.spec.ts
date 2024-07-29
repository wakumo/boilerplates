import { Test, TestingModule } from '@nestjs/testing';
import { SampleController } from './sample.controller.js';
import { SampleService } from './sample.service.js';

describe('SampleController', () => {
  let controller: SampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SampleController],
      providers: [SampleService],
    }).compile();

    controller = module.get<SampleController>(SampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
