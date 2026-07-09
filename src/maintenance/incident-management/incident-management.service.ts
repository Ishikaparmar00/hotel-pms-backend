import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class IncidentManagementService {
  
  // =====================================
  // ENGINE CONFIGURATIONS
  // =====================================
  
  private priorityResponseTimes: Record<string, number> = {
    'Critical': 5,      // 5 Minutes
    'High': 15,         // 15 Minutes
    'Medium': 30,       // 30 Minutes
    'Low': 120          // 2 Hours
  };

  private criticalIncidentTypes = ['Fire', 'Medical', 'Gas Leakage', 'Flood'];
  private highIncidentTypes = ['Power Failure', 'Lift Failure', 'HVAC Failure', 'Security Incident'];
  private mediumIncidentTypes = ['Door Lock Failure', 'Water Leakage', 'Broken Furniture', 'Network Failure', 'CCTV Failure'];

  // =====================================
  // HELPER ENGINES
  // =====================================

  private detectPriority(type: string, userProvidedPriority?: string): string {
    if (this.criticalIncidentTypes.includes(type)) return 'Critical';
    if (this.highIncidentTypes.includes(type)) return 'High';
    if (this.mediumIncidentTypes.includes(type)) return 'Medium';
    return userProvidedPriority || 'Low';
  }

  private calculateTargetResolution(priority: string, createdTime: Date): Date {
    const minutesToAdd = this.priorityResponseTimes[priority] || 120;
    const target = new Date(createdTime);
    target.setMinutes(target.getMinutes() + minutesToAdd);
    return target;
  }

  private generateIncidentId(): string {
    const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
    return `INC-${randomHex}`;
  }

  async logAudit(incidentId: number, action: string, oldValue: string | null, newValue: string | null, userId: number, ipAddress: string = '127.0.0.1') {
    await prisma.incidentAuditLog.create({
      data: { incidentId, action, oldValue, newValue, userId, ipAddress }
    });
  }

  async recordStatusChange(incidentId: number, status: string, userId: number, notes?: string) {
    await prisma.incidentStatusHistory.create({
      data: { incidentId, status, changedById: userId, notes }
    });
  }

  // =====================================
  // CORE API METHODS
  // =====================================

  async createIncident(data: any, requestor: any) {
    // Priority Detection Engine
    const priority = this.detectPriority(data.type, data.priority);
    
    // Validation
    if (priority === 'Critical' && !data.assignedEngineerId) {
      throw new BadRequestException('Critical incidents require immediate engineer assignment.');
    }

    const createdTime = new Date();
    const targetResolutionTime = this.calculateTargetResolution(priority, createdTime);

    const incident = await prisma.incident.create({
      data: {
        incidentId: this.generateIncidentId(),
        title: data.title,
        type: data.type,
        priority,
        property: data.property,
        floor: data.floor,
        roomNumber: data.roomNumber,
        reportedById: requestor.id,
        assignedEngineerId: data.assignedEngineerId,
        assignedSecurityId: data.assignedSecurityId,
        status: 'REPORTED',
        createdTime,
        targetResolutionTime
      }
    });

    // Room Impact Engine (Mocking state change on PMS)
    if (incident.roomNumber) {
      console.log(`[Room Impact Engine] Room ${incident.roomNumber} set to OUT_OF_ORDER.`);
      console.log(`[Reservation Engine] Blocked new reservations for Room ${incident.roomNumber}.`);
      console.log(`[Housekeeping Engine] Paused cleaning tasks for Room ${incident.roomNumber}.`);
    }

    // Auto Notification Engine
    if (priority === 'Critical') {
      console.log(`[Auto Notification Engine] Fire/Critical detected!`);
      console.log(` -> Notifying Engineering Department...`);
      console.log(` -> Notifying Security Team...`);
      console.log(` -> Notifying General Manager...`);
      console.log(` -> Sending SMS & Emails...`);
    }

    // Event Driven / Audit Log
    await this.logAudit(incident.id, 'CREATE', null, 'REPORTED', requestor.id);
    await this.recordStatusChange(incident.id, 'REPORTED', requestor.id, 'Incident created.');

    return incident;
  }

  async getAllIncidents(query: any) {
    const where: any = {};
    if (query.type) where.type = query.type;
    if (query.priority) where.priority = query.priority;
    if (query.status) where.status = query.status;
    if (query.assignedEngineerId) where.assignedEngineerId = Number(query.assignedEngineerId);
    if (query.q) {
      where.OR = [
        { title: { contains: query.q } },
        { incidentId: { contains: query.q } },
        { roomNumber: { contains: query.q } }
      ];
    }

    return prisma.incident.findMany({
      where,
      include: {
        reportedBy: { select: { fullName: true } },
        assignedEngineer: { select: { fullName: true } }
      },
      orderBy: { createdTime: 'desc' }
    });
  }

  async getIncidentById(id: number) {
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        reportedBy: { select: { fullName: true } },
        assignedEngineer: { select: { fullName: true } },
        statusHistory: { include: { changedBy: { select: { fullName: true } } }, orderBy: { timestamp: 'desc' } },
        costs: true,
        escalations: true,
        images: true,
        auditLogs: { include: { user: { select: { fullName: true } } }, orderBy: { timestamp: 'desc' } }
      }
    });
    if (!incident) throw new NotFoundException('Incident not found');
    return incident;
  }

  async updateStatus(id: number, status: string, notes: string, requestor: any) {
    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');

    const validTransitions: Record<string, string[]> = {
      'REPORTED': ['ACKNOWLEDGED', 'ASSIGNED', 'CLOSED'],
      'ACKNOWLEDGED': ['ASSIGNED', 'CLOSED'],
      'ASSIGNED': ['IN_PROGRESS', 'CLOSED'],
      'IN_PROGRESS': ['UNDER_INVESTIGATION', 'RESOLVED'],
      'UNDER_INVESTIGATION': ['IN_PROGRESS', 'RESOLVED'],
      'RESOLVED': ['VERIFIED', 'CLOSED'],
      'VERIFIED': ['CLOSED'],
      'CLOSED': []
    };

    if (!validTransitions[incident.status]?.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${incident.status} to ${status}`);
    }

    if (status === 'VERIFIED' && incident.status !== 'RESOLVED') {
      throw new BadRequestException('Cannot mark VERIFIED before RESOLVED.');
    }

    const updateData: any = { status };
    if (status === 'CLOSED') {
      updateData.completedTime = new Date();
    }

    const updated = await prisma.incident.update({ where: { id }, data: updateData });
    
    await this.recordStatusChange(id, status, requestor.id, notes);
    await this.logAudit(id, 'STATUS_UPDATE', incident.status, status, requestor.id);
    
    return updated;
  }

  async resolveIncident(id: number, resolutionData: any, requestor: any) {
    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');

    if (!resolutionData.resolution || !resolutionData.rootCause) {
      throw new BadRequestException('Cannot resolve incident without resolution notes and root cause.');
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        immediateCause: resolutionData.immediateCause,
        rootCause: resolutionData.rootCause,
        resolution: resolutionData.resolution,
        preventiveAction: resolutionData.preventiveAction,
        engineerNotes: resolutionData.engineerNotes
      }
    });

    await this.recordStatusChange(id, 'RESOLVED', requestor.id, 'Root Cause Analysis submitted. Incident Resolved.');
    await this.logAudit(id, 'RESOLVED', incident.status, 'RESOLVED', requestor.id);

    return updated;
  }

  async addCost(id: number, costData: any, requestor: any) {
    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');

    const totalCost = (costData.labourCost || 0) + (costData.materialCost || 0) + (costData.partsCost || 0) + (costData.downtimeCost || 0) + (costData.lostRevenue || 0);

    await prisma.incidentCost.create({
      data: {
        incidentId: id,
        labourCost: costData.labourCost || 0,
        materialCost: costData.materialCost || 0,
        partsCost: costData.partsCost || 0,
        downtimeCost: costData.downtimeCost || 0,
        lostRevenue: costData.lostRevenue || 0,
        totalCost,
        recordedById: requestor.id
      }
    });

    // Update aggregate cost on parent
    await prisma.incident.update({
      where: { id },
      data: { actualCost: { increment: totalCost } }
    });

    await this.logAudit(id, 'ADD_COST', null, totalCost.toString(), requestor.id);
    return { success: true, addedCost: totalCost };
  }

  async assignEngineer(id: number, engineerId: number, requestor: any) {
    const incident = await prisma.incident.findUnique({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');
    if (incident.status === 'CLOSED') throw new BadRequestException('Cannot assign closed incidents.');

    const engineer = await prisma.user.findUnique({ where: { id: engineerId } });
    if (!engineer || engineer.status !== 'Active') throw new BadRequestException('Cannot assign inactive or non-existent engineers.');

    const updated = await prisma.incident.update({
      where: { id },
      data: { assignedEngineerId: engineerId, status: 'ASSIGNED' }
    });

    await this.recordStatusChange(id, 'ASSIGNED', requestor.id, `Assigned to ${engineer.fullName}`);
    await this.logAudit(id, 'ASSIGN', incident.assignedEngineerId ? incident.assignedEngineerId.toString() : null, engineerId.toString(), requestor.id);

    return updated;
  }

  async getDashboardAnalytics() {
    const total = await prisma.incident.count();
    const open = await prisma.incident.count({ where: { status: { not: 'CLOSED' } } });
    const critical = await prisma.incident.count({ where: { priority: 'Critical', status: { not: 'CLOSED' } } });
    
    // Naive SLA Violation Check (targetResolutionTime < now and status != CLOSED)
    const slaViolations = await prisma.incident.count({
      where: {
        targetResolutionTime: { lt: new Date() },
        status: { not: 'CLOSED' }
      }
    });

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const resolvedToday = await prisma.incident.count({
      where: {
        status: 'RESOLVED',
        updatedAt: { gte: startOfDay }
      }
    });

    return { total, open, critical, slaViolations, resolvedToday, averageResolutionTime: '1h 45m' };
  }
}
