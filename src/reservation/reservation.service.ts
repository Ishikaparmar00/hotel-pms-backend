import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reservation.findMany();
  }

  async findOne(id: number) {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    if (
      new Date(data.checkOut) <=
      new Date(data.checkIn)
    ) {
      throw new Error(
        'Check-out date must be after check-in date',
      );
    }

    const room = await this.prisma.room.findUnique({
      where: { id: data.roomId },
    });

    if (!room) {
      throw new Error('Room not found');
    }

    const existingReservation =
      await this.prisma.reservation.findFirst({
        where: {
          roomId: data.roomId,
          AND: [
            {
              checkIn: {
                lte: new Date(data.checkOut),
              },
            },
            {
              checkOut: {
                gte: new Date(data.checkIn),
              },
            },
          ],
        },
      });

    if (existingReservation) {
      throw new Error(
        'Room already booked for selected dates',
      );
    }

    const reservation =
      await this.prisma.reservation.create({
        data,
      });
    await this.prisma.room.update({
      where: {
        id: data.roomId,
      },
     data: {
        status: 'OCCUPIED',
      },
   });

    await this.prisma.folio.create({
      data: {
        reservationId: reservation.id,
        balance: 0,
        status: 'OPEN',
      },
    });

    return reservation;
  }

  async update(id: number, data: any) {
    return this.prisma.reservation.update({
      where: { id },
      data,
    });
  }
async checkin(id: number) {
  const reservation =
    await this.prisma.reservation.findUnique({
      where: { id },
    });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  await this.prisma.reservation.update({
    where: { id },
    data: {
      status: 'CHECKED_IN',
    },
  });

  await this.prisma.room.update({
    where: {
      id: reservation.roomId,
    },
    data: {
      status: 'OCCUPIED',
    },
  });

  return {
    message: 'Guest checked in successfully',
  };
}

async checkout(id: number) {

  const reservation =
    await this.prisma.reservation.findUnique({
      where: { id },
    });

  if (!reservation) {
    throw new Error('Reservation not found');
  }

  await this.prisma.reservation.update({
    where: { id },
    data: {
      status: 'COMPLETED',
    },
  });

  await this.prisma.room.update({
    where: {
      id: reservation.roomId,
    },
    data: {
      status: 'AVAILABLE',
    },
  });
const folio = await this.prisma.folio.findFirst({
  where: {
    reservationId: id,
  },
});

if (folio) {
  await this.prisma.folio.update({
    where: {
      id: folio.id,
    },
    data: {
      status: 'CLOSED',
    },
  });
}


  return {
    message: 'Guest checked out successfully',
  };
}

async checkAvailability(
  roomId: number,
  checkIn: string,
  checkOut: string,
) {
  const reservation =
    await this.prisma.reservation.findFirst({
      where: {
        roomId,
        AND: [
          {
            checkIn: {
              lte: new Date(checkOut),
            },
          },
          {
            checkOut: {
              gte: new Date(checkIn),
            },
          },
        ],
      },
    });

  return {
    available: !reservation,
  };
}

  async remove(id: number) {
    return this.prisma.reservation.delete({
      where: { id },
    });
  }
}