import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Hotel Partners for Discovery module...');

  const amenities = [
    'Swimming Pool', 'Free WiFi', 'Restaurant', 'Spa', 'Gym', 
    'Airport Shuttle', 'Parking', 'Room Service'
  ];

  const hotelsData = [
    {
      name: 'Grand Horizon Resort',
      latitude: 15.4989,
      longitude: 73.8278,
      address: 'Panaji, Goa, India',
      phone: '+91 9876543210',
      email: 'contact@grandhorizon.com',
      starRating: 5,
      averageRating: 4.8,
      totalReviews: 1240,
      basePrice: 250,
      availableRooms: 18,
      totalRooms: 100,
      description: 'Luxury resort overlooking the ocean.',
    },
    {
      name: 'Oasis Business Hotel',
      latitude: 15.5050,
      longitude: 73.8110,
      address: 'Miramar, Goa, India',
      phone: '+91 9876543211',
      email: 'info@oasishotel.com',
      starRating: 4,
      averageRating: 4.2,
      totalReviews: 850,
      basePrice: 120,
      availableRooms: 45,
      totalRooms: 150,
      description: 'Perfect for business travelers with quick access to the city center.',
    },
    {
      name: 'Seaside Family Villas',
      latitude: 15.5132,
      longitude: 73.7654,
      address: 'Calangute, Goa, India',
      phone: '+91 9876543212',
      email: 'booking@seasidevillas.com',
      starRating: 3,
      averageRating: 4.5,
      totalReviews: 2100,
      basePrice: 80,
      availableRooms: 5,
      totalRooms: 50,
      description: 'Family-friendly villas right on the beach.',
    },
    {
      name: 'The Royal Heritage',
      latitude: 15.4800,
      longitude: 73.8200,
      address: 'Old Goa, India',
      phone: '+91 9876543213',
      email: 'hello@royalheritage.in',
      starRating: 5,
      averageRating: 4.9,
      totalReviews: 450,
      basePrice: 400,
      availableRooms: 10,
      totalRooms: 30,
      description: 'Experience the regal history in a renovated heritage property.',
    }
  ];

  for (const h of hotelsData) {
    const hotel = await prisma.hotelPartner.create({
      data: {
        ...h,
        amenities: {
          create: amenities
            .sort(() => 0.5 - Math.random())
            .slice(0, 5) // random 5 amenities
            .map((a) => ({ name: a, category: 'General' })),
        },
        rooms: {
          create: [
            { roomType: 'Deluxe', remainingRooms: Math.floor(Math.random() * 10), currentPrice: h.basePrice, occupancyPercent: 80 },
            { roomType: 'Suite', remainingRooms: Math.floor(Math.random() * 5), currentPrice: h.basePrice * 2, occupancyPercent: 90 },
            { roomType: 'Standard', remainingRooms: Math.floor(Math.random() * 20), currentPrice: h.basePrice * 0.7, occupancyPercent: 60 }
          ]
        },
        reviews: {
          create: [
            {
              reviewerName: 'John Doe',
              cleanliness: 9.5, staff: 9.8, food: 9.0, location: 9.9, facilities: 9.2, comfort: 9.5, valueForMoney: 9.0, wifi: 8.5, overallScore: 9.3
            }
          ]
        },
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'Exterior', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', caption: 'Room', isPrimary: false }
          ]
        }
      }
    });
    console.log(`Created hotel: ${hotel.name}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
