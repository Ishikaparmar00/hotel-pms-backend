import { Test, TestingModule } from '@nestjs/testing';
import { HotelroomService } from './hotelroom.service';

describe('HotelroomService', () => {
  let service: HotelroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelroomService],
    }).compile();

    service = module.get<HotelroomService>(HotelroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
