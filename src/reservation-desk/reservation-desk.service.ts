import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ReservationDeskService implements OnModuleInit {

  async onModuleInit() {
    // Seed basic rooms if missing to make dashboard work
    const roomCount = await prisma.room.count();
    if (roomCount === 0) {
      await prisma.room.createMany({
        data: [
          { roomNumber: "101", roomType: "Standard Twin", status: "Available", floor: 1, price: 100 },
          { roomNumber: "102", roomType: "Standard Twin", status: "Occupied", floor: 1, price: 100 },
          { roomNumber: "103", roomType: "Standard Twin", status: "Out of Order", floor: 1, price: 100 },
          { roomNumber: "201", roomType: "Executive Suite", status: "Available", floor: 2, price: 250 },
          { roomNumber: "202", roomType: "Executive Suite", status: "Available", floor: 2, price: 250 },
          { roomNumber: "301", roomType: "Presidential Suite", status: "Available", floor: 3, price: 500 },
        ]
      });
    }

    // Seed some arrivals and departures for today if none exist
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);
    const todayEnd = new Date();
    todayEnd.setHours(23,59,59,999);
    
    const todaysArrivalsCount = await prisma.reservation.count({
      where: { checkIn: { gte: todayStart, lte: todayEnd } }
    });

    if (todaysArrivalsCount === 0) {
      const today = new Date();
      today.setHours(0,0,0,0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const rooms = await prisma.room.findMany();
      if (rooms.length > 0) {
        const rnd = Math.floor(Math.random() * 10000);
        await prisma.reservation.createMany({
          data: [
            // Arrival Today
            {
              reservationNumber: `RES-829001-${rnd}`,
              guestName: "Elena Vance",
              guestEmail: "elena@example.com",
              checkIn: today,
              checkOut: tomorrow,
              status: "Reserved",
              roomId: rooms[0].id,
              roomType: rooms[0].roomType,
              adults: 1,
              paymentStatus: "Pending"
            },
            // Arrival Today
            {
              reservationNumber: `RES-829002-${rnd}`,
              guestName: "Marcus Thorne",
              guestEmail: "marcus@example.com",
              checkIn: today,
              checkOut: tomorrow,
              status: "Confirmed",
              roomId: rooms[3].id,
              roomType: rooms[3].roomType,
              adults: 2,
              paymentStatus: "Paid"
            },
            // Departure Today
            {
              reservationNumber: `RES-829003-${rnd}`,
              guestName: "Siobhan Roy",
              guestEmail: "siobhan@example.com",
              checkIn: yesterday,
              checkOut: today,
              status: "Checked-In",
              roomId: rooms[1].id,
              roomType: rooms[1].roomType,
              adults: 2,
              paymentStatus: "Pending",
              outstandingBalance: 45.0
            },
            // Stay Over
            {
              reservationNumber: `RES-829004-${rnd}`,
              guestName: "David Kessler",
              guestEmail: "david@example.com",
              checkIn: yesterday,
              checkOut: tomorrow,
              status: "Checked-In",
              roomId: rooms[4].id,
              roomType: rooms[4].roomType,
              adults: 1,
              paymentStatus: "Paid"
            }
          ]
        });
      }
    }
  }

  private getStartOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getEndOfToday() {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }

  // --- DASHBOARD ---
  async getDashboardKpis() {
    const todayStart = this.getStartOfToday();
    const todayEnd = this.getEndOfToday();

    const arrivals = await prisma.reservation.count({
      where: {
        checkIn: { gte: todayStart, lte: todayEnd },
        status: { in: ['Reserved', 'Confirmed', 'Pending'] }
      }
    });

    const departures = await prisma.reservation.count({
      where: {
        checkOut: { gte: todayStart, lte: todayEnd },
        status: 'Checked-In'
      }
    });

    const totalRooms = await prisma.room.count();
    const vacantRooms = await prisma.room.count({ where: { status: 'Available' } });
    const occupiedRooms = await prisma.room.count({ where: { status: 'Occupied' } });
    const outOfOrderRooms = await prisma.room.count({ where: { status: 'Out of Order' } });
    const dirtyRooms = await prisma.room.count({ where: { status: 'Dirty' } });

    const occupancyPercent = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    const walkIns = await prisma.reservation.count({
      where: {
        checkIn: { gte: todayStart, lte: todayEnd },
        createdAt: { gte: todayStart, lte: todayEnd },
        status: 'Checked-In'
      }
    });

    const cancelled = await prisma.reservation.count({
      where: {
        checkIn: { gte: todayStart, lte: todayEnd },
        status: 'Cancelled'
      }
    });

    const revenueAggr = await prisma.reservation.aggregate({
      where: {
        checkIn: { gte: todayStart, lte: todayEnd },
        status: { in: ['Checked-In', 'Completed'] }
      },
      _sum: {
        depositAmount: true,
        outstandingBalance: true
      }
    });
    
    // Simplistic revenue calculation
    const revenue = (revenueAggr._sum.depositAmount || 0) + (revenueAggr._sum.outstandingBalance || 0);

    return {
      totalArrivals: arrivals,
      totalDepartures: departures,
      currentOccupancy: occupancyPercent,
      outOfOrderRooms,
      vacantRooms: vacantRooms + dirtyRooms,
      occupiedRooms,
      reservedRooms: arrivals,
      availableRooms: vacantRooms,
      vipArrivals: 0,
      walkInGuests: walkIns,
      dirtyRooms,
      cancelledReservations: cancelled,
      todayRevenue: revenue
    };
  }

  // --- DAILY OPERATIONS ---
  async getArrivals() {
    const todayStart = this.getStartOfToday();
    const todayEnd = this.getEndOfToday();
    return prisma.reservation.findMany({
      where: {
        checkIn: { gte: todayStart, lte: todayEnd },
        status: { in: ['Reserved', 'Confirmed', 'Pending'] }
      },
      include: { room: true, guestProfile: true },
      orderBy: { checkIn: 'asc' }
    });
  }

  async getDepartures() {
    const todayStart = this.getStartOfToday();
    const todayEnd = this.getEndOfToday();
    return prisma.reservation.findMany({
      where: {
        checkOut: { gte: todayStart, lte: todayEnd },
        status: 'Checked-In'
      },
      include: { room: true, guestProfile: true },
      orderBy: { checkOut: 'asc' }
    });
  }

  async getStayOvers() {
    const todayEnd = this.getEndOfToday();
    return prisma.reservation.findMany({
      where: {
        checkOut: { gt: todayEnd },
        status: 'Checked-In'
      },
      include: { room: true, guestProfile: true },
      orderBy: { guestName: 'asc' }
    });
  }

  // --- SEARCH ---
  async searchReservations(query: string) {
    return prisma.reservation.findMany({
      where: {
        OR: [
          { reservationNumber: { contains: query } },
          { guestName: { contains: query } },
          { guestEmail: { contains: query } },
          { guestProfile: { phone: { contains: query } } },
          { guestProfile: { passportNumber: { contains: query } } }
        ]
      },
      include: { room: true, guestProfile: true },
      take: 20
    });
  }

  // --- ACTIONS ---
  async walkInRegistration(data: any) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Guest Profile
      const profile = await tx.guestProfile.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          passportNumber: data.passportNumber,
          aadhaarNumber: data.aadhaarNumber,
        }
      });

      // 2. Validate Room Available
      const room = await tx.room.findUnique({ where: { id: data.roomId } });
      if (!room || room.status !== 'Available') {
        throw new BadRequestException("Room is not available for walk-in.");
      }

      // 3. Mark Room as Occupied
      await tx.room.update({
        where: { id: data.roomId },
        data: { status: 'Occupied' }
      });

      // 4. Create Reservation
      const resNum = `WLK-${Date.now().toString().slice(-6)}`;
      const reservation = await tx.reservation.create({
        data: {
          reservationNumber: resNum,
          guestName: `${data.firstName} ${data.lastName}`,
          guestEmail: data.email || "",
          checkIn: new Date(),
          checkOut: new Date(data.checkOut),
          status: 'Checked-In',
          roomId: data.roomId,
          guestProfileId: profile.id,
          roomType: room.roomType,
          adults: data.adults || 1,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.depositAmount > 0 ? 'Partial' : 'Pending',
          depositAmount: data.depositAmount || 0,
          identityVerified: true,
          checkInTime: new Date()
        },
        include: { room: true, guestProfile: true }
      });

      return reservation;
    });
  }

  async checkInReservation(id: number, actionData: any) {
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({ where: { id }, include: { room: true } });
      if (!reservation) throw new NotFoundException('Reservation not found');
      if (reservation.status === 'Checked-In') throw new BadRequestException('Already checked in');

      let targetRoomId = reservation.roomId;

      // Assign room logic
      if (actionData?.assignRoomId) {
        const room = await tx.room.findUnique({ where: { id: actionData.assignRoomId } });
        if (!room || room.status !== 'Available') throw new BadRequestException('Room is not available');
        targetRoomId = room.id;
      } else {
        // Validate current room is still available if no explicit assignment
        if (reservation.room.status !== 'Available' && reservation.room.status !== 'Reserved') {
            throw new BadRequestException('Assigned room is currently not available. Please assign another room.');
        }
      }

      // Mark room occupied
      await tx.room.update({
        where: { id: targetRoomId },
        data: { status: 'Occupied' }
      });

      // Mark reservation checked in
      return tx.reservation.update({
        where: { id },
        data: {
          status: 'Checked-In',
          roomId: targetRoomId,
          checkInTime: new Date(),
          identityVerified: actionData?.identityVerified || false,
          depositAmount: reservation.depositAmount + (actionData?.addDeposit || 0)
        },
        include: { room: true, guestProfile: true }
      });
    });
  }

  async checkOutReservation(id: number, actionData: any) {
    return prisma.$transaction(async (tx) => {
      const reservation = await tx.reservation.findUnique({ where: { id } });
      if (!reservation) throw new NotFoundException('Reservation not found');
      if (reservation.status !== 'Checked-In') throw new BadRequestException('Cannot checkout. Not checked in.');

      // Mark room dirty
      const updatedRoom = await tx.room.update({
        where: { id: reservation.roomId },
        data: { status: 'Dirty' }
      });

      // Mark reservation completed
      const updatedRes = await tx.reservation.update({
        where: { id },
        data: {
          status: 'Completed',
          checkOutTime: new Date(),
          paymentStatus: 'Paid',
          outstandingBalance: 0
        },
        include: { room: true }
      });

      // Automatically spawn Housekeeping task
      await tx.housekeepingTask.create({
        data: {
          roomNumber: updatedRoom.roomNumber,
          cleaningType: 'Departure',
          priority: 'High',
          estimatedTime: 45,
          status: 'To Do',
          notes: 'Auto-spawned from Check-Out'
        }
      });

      return updatedRes;
    });
  }

  // --- VERIFICATION DESK ---
  async verifyGuest(id: number, actionData: any) {
    return prisma.reservation.update({
      where: { id },
      data: {
        identityVerified: true,
        verificationStatus: 'Verified',
        idDocumentType: actionData.idDocumentType,
        idDocumentUrl: actionData.idDocumentUrl,
        signatureUrl: actionData.signatureUrl,
        guestPhotoUrl: actionData.guestPhotoUrl
      },
      include: { guestProfile: true }
    });
  }
}
