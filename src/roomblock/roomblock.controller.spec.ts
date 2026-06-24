import { Test, TestingModule } from '@nestjs/testing';
import { RoomblockController } from './roomblock.controller';

describe('RoomblockController', () => {
  let controller: RoomblockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomblockController],
    }).compile();

    controller = module.get<RoomblockController>(RoomblockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
