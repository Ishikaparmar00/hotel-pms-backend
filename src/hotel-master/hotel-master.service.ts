import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient, MasterHotel, MasterRoomType, MasterRestaurant } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class HotelMasterService {
  
  // ==========================================
  // HOTEL MASTER CRUD
  // ==========================================
  
  async getCategories() {
    return prisma.masterHotelCategory.findMany();
  }

  async createCategory(data: { name: string }) {
    return prisma.masterHotelCategory.upsert({
      where: { name: data.name },
      update: {},
      create: { name: data.name }
    });
  }
  
  async getHotels(skip: number = 0, take: number = 10, search?: string) {
    const where = search ? { hotelName: { contains: search } } : {};
    const [data, total] = await Promise.all([
      prisma.masterHotel.findMany({ where, skip, take, include: { roomTypes: true, restaurants: true } }),
      prisma.masterHotel.count({ where })
    ]);
    return { data, total, skip, take };
  }

  async getHotelById(id: number) {
    const hotel = await prisma.masterHotel.findUnique({
      where: { id },
      include: { roomTypes: true, restaurants: true }
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async createHotel(data: Partial<MasterHotel>) {
    if (data.email) this.validateEmail(data.email);
    if (data.phoneNumber) this.validatePhone(data.phoneNumber);
    
    // Auto generate Hotel Code e.g. HTL-XXXX
    const count = await prisma.masterHotel.count();
    const hotelCode = `HTL-${(count + 1).toString().padStart(4, '0')}`;
    
    // Ensure no duplicate code (rare edge case with concurrent creates)
    const existing = await prisma.masterHotel.findUnique({ where: { hotelCode } });
    if (existing) throw new BadRequestException('Hotel Code collision, please retry.');

    return prisma.masterHotel.create({
      data: {
        ...data,
        hotelCode
      } as MasterHotel
    });
  }

  async updateHotel(id: number, data: Partial<MasterHotel>) {
    if (data.email) this.validateEmail(data.email);
    if (data.phoneNumber) this.validatePhone(data.phoneNumber);
    
    // Prevent updating hotel code
    delete data.hotelCode;

    return prisma.masterHotel.update({
      where: { id },
      data
    });
  }

  async deleteHotel(id: number) {
    return prisma.masterHotel.delete({ where: { id } });
  }

  // ==========================================
  // ROOM TYPE CRUD
  // ==========================================
  
  async addRoomType(hotelId: number, data: Partial<MasterRoomType>) {
    if (data.numberOfRooms !== undefined && data.numberOfRooms < 0) {
      throw new BadRequestException('Number of rooms cannot be negative');
    }
    const rt = await prisma.masterRoomType.create({
      data: { ...data, hotelId } as MasterRoomType
    });
    await this.recalculateHotelTotals(hotelId);
    return rt;
  }

  async updateRoomType(id: number, data: Partial<MasterRoomType>) {
    if (data.numberOfRooms !== undefined && data.numberOfRooms < 0) {
      throw new BadRequestException('Number of rooms cannot be negative');
    }
    const rt = await prisma.masterRoomType.update({ where: { id }, data });
    await this.recalculateHotelTotals(rt.hotelId);
    return rt;
  }

  async deleteRoomType(id: number) {
    const rt = await prisma.masterRoomType.delete({ where: { id } });
    await this.recalculateHotelTotals(rt.hotelId);
    return rt;
  }

  // ==========================================
  // RESTAURANT CRUD
  // ==========================================
  
  async addRestaurant(hotelId: number, data: Partial<MasterRestaurant>) {
    const r = await prisma.masterRestaurant.create({
      data: { ...data, hotelId } as MasterRestaurant
    });
    await this.recalculateHotelTotals(hotelId);
    return r;
  }

  async updateRestaurant(id: number, data: Partial<MasterRestaurant>) {
    const r = await prisma.masterRestaurant.update({ where: { id }, data });
    await this.recalculateHotelTotals(r.hotelId);
    return r;
  }

  async deleteRestaurant(id: number) {
    const r = await prisma.masterRestaurant.delete({ where: { id } });
    await this.recalculateHotelTotals(r.hotelId);
    return r;
  }

  // ==========================================
  // DASHBOARD AGGREGATES
  // ==========================================
  async getDashboardStats() {
    const hotels = await prisma.masterHotel.findMany();
    const totalHotels = hotels.length;
    const totalRooms = hotels.reduce((sum, h) => sum + h.totalRooms, 0);
    const totalRoomTypes = hotels.reduce((sum, h) => sum + h.totalRoomTypes, 0);
    const totalRestaurants = hotels.reduce((sum, h) => sum + h.totalRestaurants, 0);
    
    return {
      totalHotels,
      totalRooms,
      totalRoomTypes,
      totalRestaurants,
      availableRooms: totalRooms, // Stub - integrate with live PMS availability later
      occupiedRooms: 0,           // Stub
      roomOccupancyPercent: 0     // Stub
    };
  }

  // ==========================================
  // UTILS & BUSINESS RULES
  // ==========================================

  private async recalculateHotelTotals(hotelId: number) {
    const roomTypes = await prisma.masterRoomType.findMany({ where: { hotelId } });
    const restaurants = await prisma.masterRestaurant.findMany({ where: { hotelId } });

    const totalRooms = roomTypes.reduce((sum, rt) => sum + rt.numberOfRooms, 0);
    const totalRoomTypes = roomTypes.length;
    const totalRestaurants = restaurants.length;

    await prisma.masterHotel.update({
      where: { id: hotelId },
      data: {
        totalRooms,
        totalRoomTypes,
        totalRestaurants
      }
    });
  }

  private validateEmail(email: string) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }
  }

  private validatePhone(phone: string) {
    if (!phone || phone.length < 10) {
      throw new BadRequestException('Invalid phone number format');
    }
  }

  // ============================================
  // SEARCH & LISTING
  // ============================================

  // Haversine distance calculation in km
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async searchHotels(query: any) {
    const { 
      destination, lat, lng, 
      minPrice, maxPrice, 
      category, 
      foodType,
      amenities // comma separated string e.g., 'hasSwimmingPool,hasFreeWiFi'
    } = query;

    // Build the basic Prisma where clause
    const where: any = {};

    if (destination) {
      where.OR = [
        { city: { contains: destination } },
        { state: { contains: destination } },
        { area: { contains: destination } }
      ];
    }

    if (category) {
      where.hotelCategory = category;
    }

    // Process amenities
    if (amenities) {
      const amArray = amenities.split(',');
      for (const am of amArray) {
        if (['hasSwimmingPool', 'hasSpa', 'hasGym', 'hasParking', 'hasAirportPickup', 'hasFreeWiFi', 'hasPetFriendly', 'hasRoomService', 'hasBar', 'hasConferenceHall'].includes(am)) {
          where[am] = true;
        }
      }
    }

    // Fetch hotels with RoomTypes and Restaurants
    const hotels = await prisma.masterHotel.findMany({
      where,
      include: {
        roomTypes: true,
        restaurants: true
      }
    });

    // Post-process the results (filtering by price, foodType, and adding distance)
    const processedHotels = hotels.map(hotel => {
      // Find starting price
      const startingPrice = hotel.roomTypes.length > 0 
        ? Math.min(...hotel.roomTypes.map(r => r.basePrice)) 
        : 0;

      // Calculate distance if coordinates are provided
      let distance: number | null = null;
      if (lat && lng && hotel.latitude && hotel.longitude) {
        distance = this.calculateDistance(
          parseFloat(lat), parseFloat(lng),
          hotel.latitude, hotel.longitude
        );
      }

      // Check food type filter
      let matchesFoodType = true;
      if (foodType) {
         matchesFoodType = hotel.restaurants.some(r => r.foodType === foodType);
      }

      return {
        ...hotel,
        startingPrice,
        distance,
        matchesFoodType
      };
    })
    .filter(h => h.matchesFoodType)
    .filter(h => {
      if (minPrice && h.startingPrice < parseFloat(minPrice)) return false;
      if (maxPrice && h.startingPrice > parseFloat(maxPrice)) return false;
      return true;
    });

    // Sort by distance (if available), then by rating
    processedHotels.sort((a, b) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return b.hotelRating - a.hotelRating; // default sort by rating
    });

    return processedHotels;
  }
}
