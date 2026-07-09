import { Test, TestingModule } from '@nestjs/testing';
import { ReservationDeskController } from './reservation-desk.controller';

describe('ReservationDeskController', () => {
  let controller: ReservationDeskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationDeskController],
    }).compile();

    controller = module.get<ReservationDeskController>(ReservationDeskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
