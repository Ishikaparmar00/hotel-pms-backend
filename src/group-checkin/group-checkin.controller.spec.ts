import { Test, TestingModule } from '@nestjs/testing';
import { GroupCheckinController } from './group-checkin.controller';

describe('GroupCheckinController', () => {
  let controller: GroupCheckinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupCheckinController],
    }).compile();

    controller = module.get<GroupCheckinController>(GroupCheckinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
