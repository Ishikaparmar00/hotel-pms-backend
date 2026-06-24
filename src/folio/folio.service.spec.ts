import { Test, TestingModule } from '@nestjs/testing';
import { FolioService } from './folio.service';

describe('FolioService', () => {
  let service: FolioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FolioService],
    }).compile();

    service = module.get<FolioService>(FolioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
