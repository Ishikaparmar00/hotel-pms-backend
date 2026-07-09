import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async register(data: any) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        companyName: data.companyName,
        hotelName: data.hotelName,
        country: data.country,
        city: data.city,
        role: data.role || 'Guest',
        status: 'Pending', // pending email verification
      },
    });

    // Generate Verification Token/OTP
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.emailVerification.create({
      data: {
        userId: user.id,
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      }
    });

    return { message: 'Registration successful. Please verify your email.', userId: user.id };
  }

  async login(loginDto: any, ipAddress?: string, browser?: string, os?: string) {
    const user = await prisma.user.findUnique({ where: { email: loginDto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      throw new UnauthorizedException('Account is locked due to too many failed attempts. Try again later.');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      const attempts = user.failedLoginAttempts + 1;
      let lockout: Date | null = null;
      if (attempts >= 5) {
        lockout = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLoginAttempts: attempts, lockoutUntil: lockout }
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Success
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockoutUntil: null, lastLogin: new Date() }
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = crypto.randomBytes(40).toString('hex');

    await prisma.refreshToken.create({
      data: {
        token: refresh_token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    });

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        browser,
        os,
        status: 'Success'
      }
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status
      }
    };
  }

  async logout(userId: number, refreshToken: string) {
    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken, userId },
        data: { isRevoked: true }
      });
    }
    
    const lastLogin = await prisma.loginHistory.findFirst({
      where: { userId, logoutTime: null },
      orderBy: { loginTime: 'desc' }
    });

    if (lastLogin) {
      await prisma.loginHistory.update({
        where: { id: lastLogin.id },
        data: { logoutTime: new Date() }
      });
    }

    return { message: 'Logged out successfully' };
  }

  async refreshToken(token: string) {
    const rt = await prisma.refreshToken.findUnique({ where: { token } });
    if (!rt || rt.isRevoked || rt.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: rt.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    
    return { access_token };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Email not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.otp.create({
      data: {
        userId: user.id,
        code: otp,
        purpose: 'FORGOT_PASSWORD',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      }
    });

    // In a real app, send email here
    return { message: 'OTP sent to email', otp }; // Returning OTP for dev/testing ease
  }

  async verifyOtp(email: string, code: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const otpRecord = await prisma.otp.findFirst({
      where: { userId: user.id, code, purpose: 'FORGOT_PASSWORD', isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' }
    });

    if (!otpRecord) throw new BadRequestException('Invalid or expired OTP');

    await prisma.otp.update({ where: { id: otpRecord.id }, data: { isUsed: true } });

    const resetToken = crypto.randomBytes(32).toString('hex');
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    return { resetToken };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const pr = await prisma.passwordReset.findUnique({ where: { token: resetToken } });
    if (!pr || pr.isUsed || pr.expiresAt < new Date()) throw new BadRequestException('Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: pr.userId },
      data: { password: hashedPassword }
    });

    await prisma.passwordReset.update({ where: { id: pr.id }, data: { isUsed: true } });

    await prisma.auditLog.create({
      data: {
        action: 'PASSWORD_RESET',
        entity: 'USER',
        entityId: pr.userId,
        performedBy: pr.userId,
        details: 'Password was reset using OTP'
      }
    });

    return { message: 'Password updated successfully' };
  }
}
