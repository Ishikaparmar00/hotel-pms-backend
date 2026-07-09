import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class HousekeepingService implements OnModuleInit {
  async onModuleInit() {
    const staffCount = await prisma.housekeepingStaff.count();
    if (staffCount === 0) {
      // Seed some staff
      await prisma.housekeepingStaff.createMany({
        data: [
          {
            employeeId: "HK-1001",
            name: "Maria Rodriguez",
            mobileNumber: "+1-555-0100",
            email: "maria@hotel.com",
            shift: "Morning",
            assignedFloor: 1,
            experience: 3,
            status: "Active"
          },
          {
            employeeId: "HK-1002",
            name: "James Smith",
            mobileNumber: "+1-555-0101",
            email: "james@hotel.com",
            shift: "Evening",
            assignedFloor: 2,
            experience: 5,
            status: "Active"
          }
        ]
      });

      const staffs = await prisma.housekeepingStaff.findMany();

      // Seed tasks
      await prisma.housekeepingTask.createMany({
        data: [
          {
            roomNumber: "101",
            cleaningType: "Departure",
            priority: "High",
            estimatedTime: 45,
            status: "To Do"
          },
          {
            roomNumber: "102",
            cleaningType: "Occupied",
            priority: "Medium",
            assignedStaffId: staffs[0].id,
            estimatedTime: 30,
            status: "In Progress",
            startedAt: new Date(Date.now() - 1000 * 60 * 15) // Started 15 mins ago
          },
          {
            roomNumber: "105",
            cleaningType: "Touch Up",
            priority: "High",
            assignedStaffId: staffs[0].id,
            estimatedTime: 20,
            status: "Inspection",
            startedAt: new Date(Date.now() - 1000 * 60 * 60)
          },
          {
            roomNumber: "205",
            cleaningType: "Deep Clean",
            priority: "Low",
            assignedStaffId: staffs[1].id,
            estimatedTime: 90,
            actualTime: 85,
            status: "Completed",
            startedAt: new Date(Date.now() - 1000 * 60 * 120),
            completedAt: new Date(Date.now() - 1000 * 60 * 35)
          }
        ]
      });
    }
  }

  // --- STAFF ---
  async getAllStaff() {
    return prisma.housekeepingStaff.findMany({
      include: {
        tasks: {
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0,0,0,0))
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });
  }

  async createStaff(data: any) {
    if (!data.employeeId) {
      data.employeeId = `HK-${Date.now().toString().slice(-4)}`;
    }
    return prisma.housekeepingStaff.create({ data });
  }

  async updateStaff(id: number, data: any) {
    return prisma.housekeepingStaff.update({
      where: { id },
      data
    });
  }

  async deleteStaff(id: number) {
    return prisma.housekeepingStaff.delete({ where: { id } });
  }

  // --- TASKS ---
  async getAllTasks() {
    return prisma.housekeepingTask.findMany({
      include: { assignedStaff: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getEligibleRooms() {
    // Rooms that are not OOO and not currently assigned an active task
    const activeTasks = await prisma.housekeepingTask.findMany({
      where: { status: { in: ['To Do', 'In Progress', 'Inspection'] } },
      select: { roomNumber: true }
    });
    
    const activeRoomNumbers = activeTasks.map(t => t.roomNumber);
    
    // We fetch from MasterRoom / Room
    return prisma.room.findMany({
      where: {
        roomNumber: { notIn: activeRoomNumbers },
        status: { not: 'Maintenance' } // assuming Maintenance = OOO
      },
      select: {
        roomNumber: true,
        roomType: true,
        floor: true,
        status: true
      },
      orderBy: { roomNumber: 'asc' }
    });
  }

  async createTask(data: any) {
    if (data.assignedStaffId) {
      // Validation 1: Check workload limit (max 10)
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const workload = await prisma.housekeepingTask.count({
        where: {
          assignedStaffId: parseInt(data.assignedStaffId),
          createdAt: { gte: today }
        }
      });
      
      if (workload >= 10) {
        throw new BadRequestException('Workload exceeded. Staff member already has 10 tasks today.');
      }
    }

    // Validation 2: Check duplicate assignment
    const existingActiveTask = await prisma.housekeepingTask.findFirst({
      where: {
        roomNumber: data.roomNumber,
        status: { in: ['To Do', 'In Progress', 'Inspection'] }
      }
    });

    if (existingActiveTask) {
      throw new BadRequestException(`Room ${data.roomNumber} is already assigned and not yet completed.`);
    }

    // Ensure staff ID is int if present
    if (data.assignedStaffId) data.assignedStaffId = parseInt(data.assignedStaffId);
    if (data.estimatedTime) data.estimatedTime = parseInt(data.estimatedTime);
    if (data.dueTime) data.dueTime = new Date(data.dueTime);

    const task = await prisma.housekeepingTask.create({ 
      data,
      include: { assignedStaff: true }
    });
    return task;
  }

  async updateTaskStatus(id: number, status: string, actionData?: any) {
    const task = await prisma.housekeepingTask.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    const updateData: any = { status };

    if (status === 'In Progress' && task.status === 'To Do') {
      updateData.startedAt = new Date();
    }
    
    // Status can flow into Inspection or skip directly to Completed
    if (status === 'Completed' && (task.status === 'In Progress' || task.status === 'Inspection')) {
      updateData.completedAt = new Date();
      if (task.startedAt) {
        updateData.actualTime = Math.round((new Date().getTime() - task.startedAt.getTime()) / 60000);
      }
      
      // Update the MasterRoom status to "Available"
      await prisma.room.update({
        where: { roomNumber: task.roomNumber },
        data: { status: 'Available' }
      }).catch(e => console.log('Room not found in MasterRoom, skipping status update'));
    }

    if (actionData?.assignedStaffId) {
      updateData.assignedStaffId = parseInt(actionData.assignedStaffId);
    }

    return prisma.housekeepingTask.update({
      where: { id },
      data: updateData,
      include: { assignedStaff: true }
    });
  }

  // --- ANALYTICS & DASHBOARD ---
  async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [activeStaffCount, statusCounts, avgTimeResult] = await Promise.all([
      prisma.housekeepingStaff.count({ where: { status: 'Active' } }),
      prisma.housekeepingTask.groupBy({
        by: ['status'],
        where: { createdAt: { gte: today } },
        _count: { status: true },
      }),
      prisma.housekeepingTask.aggregate({
        where: { createdAt: { gte: today }, status: 'Completed', actualTime: { not: null } },
        _avg: { actualTime: true },
      })
    ]);

    const stats = {
      todo: 0,
      inProgress: 0,
      inspection: 0,
      completed: 0,
    };

    statusCounts.forEach((group) => {
      if (group.status === 'To Do') stats.todo = group._count.status;
      if (group.status === 'In Progress') stats.inProgress = group._count.status;
      if (group.status === 'Inspection') stats.inspection = group._count.status;
      if (group.status === 'Completed') stats.completed = group._count.status;
    });

    return {
      activeStaff: activeStaffCount,
      todo: stats.todo,
      inProgress: stats.inProgress,
      inspection: stats.inspection,
      completedToday: stats.completed,
      tasksRemaining: stats.todo + stats.inProgress + stats.inspection,
      avgCleanTime: Math.round(avgTimeResult._avg.actualTime || 0)
    };
  }

  async getAnalytics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeStaffCount = await prisma.housekeepingStaff.count({ where: { status: 'Active' } });
    const tasks = await prisma.housekeepingTask.findMany({
      where: { createdAt: { gte: today } }
    });

    let roomsWaiting = 0;
    let roomsInProgress = 0;
    let roomsCompleted = 0;
    let totalTime = 0;

    tasks.forEach(t => {
      if (t.status === 'To Do') roomsWaiting++;
      else if (t.status === 'In Progress') roomsInProgress++;
      else if (t.status === 'Completed') {
        roomsCompleted++;
        totalTime += (t.actualTime || t.estimatedTime || 0);
      }
    });

    const averageCleaningTime = roomsCompleted > 0 ? Math.round(totalTime / roomsCompleted) : 0;
    const tasksRemaining = roomsWaiting + roomsInProgress;

    return {
      activeStaffCount,
      roomsWaiting,
      roomsInProgress,
      roomsCompleted,
      tasksRemaining,
      averageCleaningTime
    };
  }
}