import { Injectable, BadRequestException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class GroupCheckinService implements OnModuleInit {
  
  async onModuleInit() {
    // Seed an initial group if none exists for demonstration
    const count = await prisma.groupBlock.count();
    if (count === 0) {
      const block = await prisma.groupBlock.create({
        data: {
          groupName: "Global Tech Summit 2024",
          groupId: "GTS-2024-001",
          companyName: "Global Tech Inc.",
          eventName: "Annual Conference",
          contactPerson: "Sarah Jenkins",
          contactNumber: "+1-555-0192",
          email: "sarah.j@globaltech.com",
          arrivalDate: new Date(new Date().setHours(0,0,0,0)), // Today
          departureDate: new Date(new Date().setDate(new Date().getDate() + 4)), // +4 days
          cutoffDate: new Date(new Date().setDate(new Date().getDate() - 7)), // -7 days
          roomsBlocked: 450,
          numberOfGuests: 800,
          roomTypesReserved: "Deluxe King, Executive Suite",
          status: "Confirmed"
        }
      });

      // Seed a few guests
      await prisma.groupGuest.createMany({
        data: [
          {
            guestName: "John Doe",
            confirmationNumber: "GTS-001",
            reservationNumber: "RES-9001",
            roomType: "Deluxe King",
            arrivalDate: block.arrivalDate,
            departureDate: block.departureDate,
            numberOfNights: 4,
            checkinStatus: "Pending",
            billingType: "Company Pay",
            groupBlockId: block.id
          },
          {
            guestName: "Jane Smith",
            confirmationNumber: "GTS-002",
            reservationNumber: "RES-9002",
            roomType: "Executive Suite",
            arrivalDate: block.arrivalDate,
            departureDate: block.departureDate,
            numberOfNights: 4,
            roomNumber: "401",
            checkinStatus: "Checked-In",
            billingType: "Guest Pay",
            groupBlockId: block.id
          }
        ]
      });
    }
  }

  // --- GROUPS ---

  async getAllGroups() {
    const groups = await prisma.groupBlock.findMany({
      include: {
        guests: true
      }
    });

    return groups.map(g => this.calculateGroupStats(g));
  }

  async getGroupById(id: number) {
    const group = await prisma.groupBlock.findUnique({
      where: { id },
      include: { guests: true }
    });
    if (!group) throw new NotFoundException('Group not found');
    return this.calculateGroupStats(group);
  }

  async createGroup(data: any) {
    // Generate Group ID
    const count = await prisma.groupBlock.count();
    data.groupId = `GRP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    
    if (data.arrivalDate) data.arrivalDate = new Date(data.arrivalDate);
    if (data.departureDate) data.departureDate = new Date(data.departureDate);
    if (data.cutoffDate) data.cutoffDate = new Date(data.cutoffDate);

    const group = await prisma.groupBlock.create({ data });
    return this.calculateGroupStats({...group, guests: []} as any);
  }

  async updateGroup(id: number, data: any) {
    if (data.arrivalDate) data.arrivalDate = new Date(data.arrivalDate);
    if (data.departureDate) data.departureDate = new Date(data.departureDate);
    if (data.cutoffDate) data.cutoffDate = new Date(data.cutoffDate);

    const group = await prisma.groupBlock.update({
      where: { id },
      data,
      include: { guests: true }
    });
    return this.calculateGroupStats(group);
  }

  async deleteGroup(id: number) {
    return prisma.groupBlock.delete({ where: { id } });
  }

  // --- GUESTS ---

  async getGroupGuests(groupId: number) {
    return prisma.groupGuest.findMany({
      where: { groupBlockId: groupId },
      orderBy: { guestName: 'asc' }
    });
  }

  async addGuest(groupId: number, data: any) {
    data.groupBlockId = groupId;
    if (data.arrivalDate) data.arrivalDate = new Date(data.arrivalDate);
    if (data.departureDate) data.departureDate = new Date(data.departureDate);
    
    // basic auto-generate if missing
    if (!data.confirmationNumber) {
      data.confirmationNumber = `CNF-${Date.now().toString().slice(-6)}`;
    }
    if (!data.reservationNumber) {
      data.reservationNumber = `RES-${Date.now().toString().slice(-6)}`;
    }

    if (data.arrivalDate && data.departureDate) {
      const nights = Math.max(1, Math.ceil((data.departureDate.getTime() - data.arrivalDate.getTime()) / (1000 * 60 * 60 * 24)));
      data.numberOfNights = nights;
    } else {
      data.numberOfNights = 1;
    }

    return prisma.groupGuest.create({ data });
  }

  async updateGuest(guestId: number, data: any) {
    if (data.arrivalDate) data.arrivalDate = new Date(data.arrivalDate);
    if (data.departureDate) data.departureDate = new Date(data.departureDate);
    
    if (data.arrivalDate && data.departureDate) {
      const nights = Math.max(1, Math.ceil((data.departureDate.getTime() - data.arrivalDate.getTime()) / (1000 * 60 * 60 * 24)));
      data.numberOfNights = nights;
    }
    
    if (data.checkinStatus === 'Checked-In' && !data.roomNumber) {
      // Find current guest to see if they already have a room
      const current = await prisma.groupGuest.findUnique({where:{id:guestId}});
      if (!current?.roomNumber && !data.roomNumber) {
         throw new BadRequestException("Cannot check-in guest without assigning a room first.");
      }
    }

    return prisma.groupGuest.update({
      where: { id: guestId },
      data
    });
  }

  async deleteGuest(guestId: number) {
    return prisma.groupGuest.delete({ where: { id: guestId } });
  }

  // --- BULK ACTIONS ---

  async bulkImportGuests(groupId: number, guestsData: any[]) {
    // Validate first
    const validGuests = guestsData.map(g => {
      const arrival = new Date(g.arrivalDate);
      const departure = new Date(g.departureDate);
      const nights = Math.max(1, Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24)));
      
      return {
        guestName: g.guestName,
        confirmationNumber: g.confirmationNumber || `CNF-${Math.random().toString().slice(2, 8)}`,
        reservationNumber: g.reservationNumber || `RES-${Math.random().toString().slice(2, 8)}`,
        roomType: g.roomType || 'Standard',
        arrivalDate: arrival,
        departureDate: departure,
        numberOfNights: nights,
        groupBlockId: groupId,
        checkinStatus: 'Pending',
        billingType: g.billingType || 'Guest Pay',
        specialRequests: g.specialRequests || ''
      };
    });

    let count = 0;
    for (const g of validGuests) {
      try {
        await prisma.groupGuest.create({ data: g });
        count++;
      } catch (err) {
        // Skip duplicate unique keys
      }
    }

    return { success: true, count };
  }

  async bulkActionGuests(groupId: number, action: string, guestIds: number[], actionData?: any) {
    const result = await prisma.$transaction(async (tx) => {
      let processed = 0;
      
      if (action === 'delete') {
        const del = await tx.groupGuest.deleteMany({
          where: { id: { in: guestIds }, groupBlockId: groupId }
        });
        processed = del.count;
      } 
      else if (action === 'checkin') {
        // Only check in those with rooms
        const guests = await tx.groupGuest.findMany({
          where: { id: { in: guestIds }, groupBlockId: groupId }
        });
        const readyGuests = guests.filter(g => g.roomNumber);
        const readyIds = readyGuests.map(g => g.id);

        if (readyIds.length > 0) {
          const upd = await tx.groupGuest.updateMany({
            where: { id: { in: readyIds } },
            data: { checkinStatus: 'Checked-In' }
          });
          processed = upd.count;
        }
      }
      else if (action === 'assign-room') {
         // Mock auto-assign logic: assign sequential rooms starting from actionData.startRoom or 101
         let currentRoom = actionData?.startRoom ? parseInt(actionData.startRoom) : 101;
         const guests = await tx.groupGuest.findMany({
           where: { id: { in: guestIds }, groupBlockId: groupId }
         });
         
         for (const g of guests) {
           if (!g.roomNumber) {
             await tx.groupGuest.update({
               where: { id: g.id },
               data: { roomNumber: currentRoom.toString() }
             });
             currentRoom++;
             processed++;
           }
         }
      }
      else if (action === 'update-arrival-time') {
        const upd = await tx.groupGuest.updateMany({
          where: { id: { in: guestIds }, groupBlockId: groupId },
          data: { arrivalTime: actionData?.arrivalTime || '14:00' }
        });
        processed = upd.count;
      }
      
      return { success: true, processed };
    });

    return result;
  }


  // --- HELPERS ---
  private calculateGroupStats(group: any) {
    const guests = group.guests || [];
    // Rooms picked up is essentially anyone who has a room assigned OR checkinStatus != Cancelled
    const pickedUpGuests = guests.filter((g: any) => g.checkinStatus !== 'Cancelled');
    const roomsPickedUp = pickedUpGuests.length;
    
    // Simulate real mockup numbers if group Name is GTS-2024-001 
    // to match user expectations (353 picked up, 450 blocked, etc) if we just want to look good,
    // but the instruction says "calculate live values".
    // "Total Rooms Blocked: 450", "Rooms Picked Up: 353", "Pickup Rate: 78.4%".
    // I seeded it with 2 guests, so pickup is 2. The user will see 2 picked up. I'll just return real math.
    
    const inventoryRemaining = Math.max(0, group.roomsBlocked - roomsPickedUp);
    const pickupRate = group.roomsBlocked > 0 ? (roomsPickedUp / group.roomsBlocked) * 100 : 0;

    return {
      ...group,
      roomsPickedUp,
      inventoryRemaining,
      pickupRate: Number(pickupRate.toFixed(2))
    };
  }
}
