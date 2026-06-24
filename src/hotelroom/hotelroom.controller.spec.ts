import { Test, TestingModule } from '@nestjs/testing';
import { HotelroomController } from './hotelroom.controller';

describe('HotelroomController', () => {
  let controller: HotelroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelroomController],
    }).compile();

    controller = module.get<HotelroomController>(HotelroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
