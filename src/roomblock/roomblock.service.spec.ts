import { Test, TestingModule } from '@nestjs/testing';
import { RoomblockService } from './roomblock.service';

describe('RoomblockService', () => {
  let service: RoomblockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomblockService],
    }).compile();

    service = module.get<RoomblockService>(RoomblockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
