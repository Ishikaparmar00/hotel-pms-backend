import { Test, TestingModule } from '@nestjs/testing';
import { FoliolineController } from './folioline.controller';

describe('FoliolineController', () => {
  let controller: FoliolineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoliolineController],
    }).compile();

    controller = module.get<FoliolineController>(FoliolineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
