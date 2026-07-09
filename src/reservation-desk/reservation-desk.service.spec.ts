import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDeskService } from './reservation-desk.service';

describe('ReservationDeskService', () => {
  let service: ReservationDeskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationDeskService],
    }).compile();

    service = module.get<ReservationDeskService>(ReservationDeskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
