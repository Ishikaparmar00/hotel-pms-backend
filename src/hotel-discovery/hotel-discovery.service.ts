import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class HotelDiscoveryService {
  async searchHotels(query: any) {
    const hotels = await prisma.hotelPartner.findMany({
      include: {
        rooms: true,
        amenities: true,
        images: true,
        reviews: true,
      },
    });

    // Score and enrich each hotel
    const enrichedHotels = hotels.map(hotel => {
      // 1. Calculate Score
      const ratingScore = hotel.averageRating * 10; // e.g. 4.8 * 10 = 48
      const priceScore = Math.max(0, 30 - (hotel.basePrice / 10)); // Arbitrary scoring, lower price = higher score
      const amenitiesScore = hotel.amenities.length * 2; // 2 points per amenity
      const popularityScore = Math.min(10, hotel.totalReviews / 100);
      const totalScore = ratingScore + priceScore + amenitiesScore + popularityScore;

      // 2. Generate Badges
      const badges: string[] = [];
      if (hotel.basePrice < 150) badges.push('Budget Friendly');
      if (hotel.averageRating >= 4.5) badges.push('Top Rated');
      if (hotel.amenities.some(a => a.name.includes('Pool') || a.name.includes('Family'))) badges.push('Family Friendly');
      if (hotel.totalReviews > 1000) badges.push('Most Booked');
      
      return {
        ...hotel,
        totalScore,
        badges,
      };
    });

    // Sort by totalScore desc by default
    return enrichedHotels.sort((a, b) => b.totalScore - a.totalScore);
  }

  async getHotelDetails(id: number) {
    const hotel = await prisma.hotelPartner.findUnique({
      where: { id },
      include: {
        rooms: true,
        amenities: true,
        images: true,
        reviews: true,
      }
    });
    if (!hotel) throw new NotFoundException('Hotel not found');
    return hotel;
  }

  async getHotelRooms(id: number) {
    const hotel = await this.getHotelDetails(id);
    return hotel.rooms;
  }

  async compareHotels(ids: number[]) {
    return prisma.hotelPartner.findMany({
      where: { id: { in: ids } },
      include: { rooms: true, amenities: true }
    });
  }
}
