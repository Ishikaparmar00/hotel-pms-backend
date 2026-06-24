import { Test, TestingModule } from '@nestjs/testing';
import { FolioController } from './folio.controller';

describe('FolioController', () => {
  let controller: FolioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FolioController],
    }).compile();

    controller = module.get<FolioController>(FolioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
