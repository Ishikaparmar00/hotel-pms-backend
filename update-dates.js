const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateDates() {
  await prisma.housekeepingTask.updateMany({
    data: {
      createdAt: new Date(),
    }
  });

  const tasks = await prisma.housekeepingTask.findMany();
  if (!tasks.some(t => t.status === 'Inspection')) {
    await prisma.housekeepingTask.create({
      data: {
        roomNumber: '305',
        cleaningType: 'Deep Clean',
        priority: 'High',
        estimatedTime: 40,
        status: 'Inspection',
        createdAt: new Date(),
        startedAt: new Date(Date.now() - 3600000)
      }
    });
  }

  console.log('Successfully updated dates and seeded Inspection task');
}

updateDates()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
