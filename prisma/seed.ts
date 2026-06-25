import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.workOrder.deleteMany();
  await prisma.engineer.deleteMany();
  await prisma.housekeeping.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.hotelRoom.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.property.deleteMany();

  // Seed Property
  const prop = await prisma.property.create({
    data: { name: 'Grand Resort', location: 'Hawaii', description: 'Luxury' }
  });

  // Seed Room Type
  const suite = await prisma.roomType.create({
    data: { name: 'Suite', baseRate: 250, propertyId: prop.id }
  });

  // Seed Rooms
  const room1 = await prisma.room.create({
    data: { roomNumber: '101', status: 'Clean', floor: 1, roomType: 'Suite', price: 250 }
  });
  const room2 = await prisma.room.create({
    data: { roomNumber: '102', status: 'Dirty', floor: 1, roomType: 'Suite', price: 250 }
  });

  // Seed Guest
  const guest = await prisma.guest.create({
    data: { fullName: 'John Doe', email: 'john@example.com', phone: '123-456-7890' }
  });
  
  const guest2 = await prisma.guest.create({
    data: { fullName: 'Alice Smith', email: 'alice@example.com', phone: '987-654-3210' }
  });

  // Seed Reservation
  await prisma.reservation.create({
    data: {
      guestName: guest.fullName,
      guestEmail: guest.email,
      checkIn: new Date(),
      checkOut: new Date(Date.now() + 86400000 * 3),
      status: 'Checked In',
      roomId: room1.id
    }
  });

  // Seed Housekeeping
  await prisma.housekeeping.create({
    data: { roomNumber: '102', task: 'Cleaning', status: 'Pending', assignedTo: 'Maria' }
  });

  // Seed Engineers
  const eng = await prisma.engineer.create({
    data: { name: 'Bob Builder', role: 'Plumber', shift: 'Morning', status: 'Active' }
  });

  // Seed Work Order
  await prisma.workOrder.create({
    data: {
      roomNumber: '101',
      issueType: 'Plumbing',
      description: 'Leaking faucet',
      priority: 'High',
      status: 'Pending',
      assignedEngineerId: eng.id.toString(),
      assignedEngineerName: eng.name
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
