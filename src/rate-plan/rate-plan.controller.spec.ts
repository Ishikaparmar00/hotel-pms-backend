import { Test, TestingModule } from '@nestjs/testing';
import { RatePlanController } from './rate-plan.controller';

describe('RatePlanController', () => {
  let controller: RatePlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatePlanController],
    }).compile();

    controller = module.get<RatePlanController>(RatePlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
