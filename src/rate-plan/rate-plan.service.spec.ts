import { Test, TestingModule } from '@nestjs/testing';
import { RatePlanService } from './rate-plan.service';

describe('RatePlanService', () => {
  let service: RatePlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatePlanService],
    }).compile();

    service = module.get<RatePlanService>(RatePlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
