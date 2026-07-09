import { Injectable, BadRequestException, OnModuleInit, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

@Injectable()
export class UsersService implements OnModuleInit {

  async onModuleInit() {
    const adminCount = await prisma.user.count({ where: { role: 'Super Admin' } });
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          fullName: 'System Admin',
          username: 'admin',
          email: 'admin@hotel.com',
          password: hashedPassword,
          role: 'Super Admin',
          department: 'Management',
          employeeId: 'EMP-001',
          status: 'Active'
        }
      });
      console.log('Default Super Admin created: admin / admin123');
    }
  }

  async logAudit(action: string, entityId: number, performedBy: number, details: string) {
    await prisma.auditLog.create({
      data: {
        action,
        entity: 'USER',
        entityId,
        performedBy,
        details
      }
    });
  }

  private generateEmployeeId(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `EMP-${year}-${rand}`;
  }

  private validatePasswordPolicy(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(password)) {
      throw new BadRequestException('Password must be at least 8 characters long and contain one uppercase, one lowercase, one number, and one special character.');
    }
  }

  async createUser(data: any, requestor: any) {
    // Role Hierarchy Protection
    if (data.role === 'Super Admin' && requestor.role !== 'Super Admin') {
      throw new UnauthorizedException('Only Super Admin can create another Super Admin.');
    }

    // Duplication checks
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
          { mobileNumber: data.mobileNumber }
        ]
      }
    });
    if (exists) {
      if (exists.email === data.email) throw new BadRequestException('Email is already in use');
      if (exists.username === data.username) throw new BadRequestException('Username is already in use');
      if (exists.mobileNumber === data.mobileNumber) throw new BadRequestException('Mobile number is already in use');
    }

    this.validatePasswordPolicy(data.password);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        employeeId: this.generateEmployeeId(),
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        mobileNumber: data.mobileNumber,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        department: data.department,
        designation: data.designation,
        joiningDate: data.joiningDate ? new Date(data.joiningDate) : new Date(),
        role: data.role,
        password: hashedPassword,
        status: data.status || 'Active',
        createdBy: requestor.id
      }
    });

    await this.logAudit('CREATE', user.id, requestor.id, `Created user ${user.username} with role ${user.role}`);

    const { password, ...result } = user;
    return result;
  }

  async updateUser(id: number, data: any, requestor: any) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'Super Admin' && requestor.role !== 'Super Admin') {
      throw new UnauthorizedException('Cannot modify Super Admin accounts.');
    }

    if (data.role === 'Super Admin' && requestor.role !== 'Super Admin') {
      throw new UnauthorizedException('Cannot elevate role to Super Admin.');
    }

    let updateData: any = {
      fullName: data.fullName,
      email: data.email,
      mobileNumber: data.mobileNumber,
      gender: data.gender,
      department: data.department,
      designation: data.designation,
      role: data.role,
      status: data.status,
      updatedBy: requestor.id
    };

    if (data.password) {
      this.validatePasswordPolicy(data.password);
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData
    });

    await this.logAudit('UPDATE', id, requestor.id, `Updated user profile/status.`);
    const { password, ...result } = updated;
    return result;
  }

  async deleteUser(id: number, requestor: any) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    if (user.id === requestor.id) throw new BadRequestException('Cannot delete yourself.');
    if (user.role === 'Super Admin' && requestor.role !== 'Super Admin') throw new UnauthorizedException('Cannot delete Super Admin accounts.');

    // Soft delete implementation
    await prisma.user.update({
      where: { id },
      data: { status: 'Deleted', updatedBy: requestor.id }
    });

    await this.logAudit('DELETE', id, requestor.id, `Soft deleted user.`);
    return { message: 'User deleted successfully' };
  }

  async findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async updateLastLogin(id: number) {
    return prisma.user.update({
      where: { id },
      data: { lastLogin: new Date() }
    });
  }

  async findAll(query?: string, role?: string, status?: string) {
    let whereClause: any = { status: { not: 'Deleted' } };
    
    if (query) {
      whereClause.OR = [
        { fullName: { contains: query } },
        { username: { contains: query } },
        { email: { contains: query } },
        { employeeId: { contains: query } }
      ];
    }
    if (role) whereClause.role = role;
    if (status) whereClause.status = status;

    return prisma.user.findMany({
      where: whereClause,
      select: {
        id: true, employeeId: true, fullName: true, username: true, email: true, 
        mobileNumber: true, role: true, department: true, designation: true, 
        status: true, lastLogin: true, joiningDate: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
