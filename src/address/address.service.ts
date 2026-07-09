import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AddressService implements OnModuleInit {
  async onModuleInit() {
    // Seed some initial data if empty
    const countryCount = await prisma.masterCountry.count();
    if (countryCount === 0) {
      const us = await prisma.masterCountry.create({ data: { name: 'United States' } });
      const ind = await prisma.masterCountry.create({ data: { name: 'India' } });

      const usState = await prisma.masterState.create({ data: { name: 'California', countryId: us.id } });
      const indState = await prisma.masterState.create({ data: { name: 'Maharashtra', countryId: ind.id } });

      await prisma.masterCity.create({ data: { name: 'San Francisco', stateId: usState.id } });
      await prisma.masterCity.create({ data: { name: 'Mumbai', stateId: indState.id } });
    }
  }

  async getCountries() {
    return prisma.masterCountry.findMany({ orderBy: { name: 'asc' } });
  }

  async addCountry(name: string) {
    return prisma.masterCountry.create({ data: { name } });
  }

  async getStates(countryId: number) {
    return prisma.masterState.findMany({
      where: { countryId },
      orderBy: { name: 'asc' }
    });
  }

  async addState(name: string, countryId: number) {
    return prisma.masterState.create({ data: { name, countryId } });
  }

  async getCities(stateId: number) {
    return prisma.masterCity.findMany({
      where: { stateId },
      orderBy: { name: 'asc' }
    });
  }

  async addCity(name: string, stateId: number) {
    return prisma.masterCity.create({ data: { name, stateId } });
  }
}
