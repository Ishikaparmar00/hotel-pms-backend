import { Test, TestingModule } from '@nestjs/testing';
import { FoliolineService } from './folioline.service';

describe('FoliolineService', () => {
  let service: FoliolineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoliolineService],
    }).compile();

    service = module.get<FoliolineService>(FoliolineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
