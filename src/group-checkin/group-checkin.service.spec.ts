import { Test, TestingModule } from '@nestjs/testing';
import { GroupCheckinService } from './group-checkin.service';

describe('GroupCheckinService', () => {
  let service: GroupCheckinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupCheckinService],
    }).compile();

    service = module.get<GroupCheckinService>(GroupCheckinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
