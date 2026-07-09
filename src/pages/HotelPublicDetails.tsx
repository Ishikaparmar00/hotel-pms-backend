import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, Wifi, Coffee, Car, Bath, ArrowLeft, Check } from "lucide-react";
import { api } from "../services/api";

export const HotelPublicDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotel-master/${id}`);
        setHotel(response);
      } catch (error) {
        console.error("Error fetching hotel", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading hotel...</div>;
  if (!hotel) return <div className="p-10 text-center font-bold text-red-500">Hotel not found.</div>;

  const numStars = parseInt(hotel.hotelCategory) || 4;
  const primaryImage = hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Top Banner */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/discovery" className="text-gray-500 hover:text-[#003B95]"><ArrowLeft /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {hotel.hotelName}
              <span className="flex text-yellow-400">
                {Array.from({ length: numStars }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </span>
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1"><MapPin size={14} className="text-blue-500"/> {hotel.address}, {hotel.area}, {hotel.city}</p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xl font-bold text-[#003B95]">{hotel.hotelRating.toFixed(1)} / 5</div>
            <div className="text-sm text-gray-500">{hotel.totalReviews} verified reviews</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Images */}
        <div className="grid grid-cols-3 gap-2 mb-8 h-[400px] rounded-xl overflow-hidden">
          <div className="col-span-2 h-full">
            <img src={primaryImage} className="w-full h-full object-cover" alt="Hotel Cover" />
          </div>
          <div className="grid grid-rows-2 gap-2 h-full">
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Room" />
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Pool" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
              <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
              
              <h3 className="font-bold text-gray-900 mt-6 mb-3">Most popular facilities</h3>
              <div className="flex flex-wrap gap-4">
                {hotel.hasFreeWiFi && <span className="flex items-center gap-2 text-green-700 font-medium"><Wifi size={18}/> Free WiFi</span>}
                {hotel.hasSwimmingPool && <span className="flex items-center gap-2 text-green-700 font-medium"><Bath size={18}/> Swimming Pool</span>}
                {hotel.hasParking && <span className="flex items-center gap-2 text-green-700 font-medium"><Car size={18}/> Free Parking</span>}
                {hotel.restaurants?.length > 0 && <span className="flex items-center gap-2 text-green-700 font-medium"><Coffee size={18}/> Restaurant</span>}
              </div>
            </div>

            {/* Room Types */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {hotel.roomTypes?.map((room: any) => (
                  <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-[#003B95] underline mb-2">{room.roomTypeName}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Beds:</strong> {room.bedType}</p>
                        <p><strong>Size:</strong> {room.roomSize}</p>
                        <p><strong>Max Occupancy:</strong> {room.maxOccupancy} Guests</p>
                      </div>
                      <div className="mt-3 space-y-1 text-sm text-green-700">
                        <div className="flex items-center gap-1"><Check size={14}/> Free Cancellation</div>
                        <div className="flex items-center gap-1"><Check size={14}/> No prepayment needed</div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Price for 1 night</p>
                        <p className="text-3xl font-bold text-gray-900">₹{room.basePrice.toLocaleString()}</p>
                        <p className="text-xs text-red-600 font-bold mt-1">Only {room.numberOfRooms} rooms left!</p>
                      </div>
                      <button className="px-6 py-2 bg-[#003B95] text-white font-bold rounded hover:bg-[#002b6e] transition-colors">
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Restaurants */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dining</h2>
              <div className="grid grid-cols-2 gap-4">
                {hotel.restaurants?.map((rest: any) => (
                  <div key={rest.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{rest.restaurantName}</h3>
                    <p className="text-sm text-gray-500 mb-3">{rest.cuisine} • {rest.restaurantType}</p>
                    <div className="space-y-2 text-sm">
                      <p><strong>Food Type:</strong> <span className="text-green-700 font-medium">{rest.foodType}</span></p>
                      <p><strong>Hours:</strong> {rest.openingTime} - {rest.closingTime}</p>
                      <p><strong>Capacity:</strong> {rest.seatingCapacity} seats</p>
                    </div>
                    <button className="mt-4 w-full py-2 border border-[#003B95] text-[#003B95] font-bold rounded hover:bg-blue-50 transition-colors">
                      View Menu
                    </button>
                  </div>
                ))}
                {hotel.restaurants?.length === 0 && <p className="text-gray-500">No dining options listed for this property.</p>}
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-[#ebf3ff] p-6 rounded-xl border border-blue-100 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Property Highlights</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#003B95] mt-0.5" />
                  Top location: Highly rated by recent guests ({hotel.hotelRating.toFixed(1)})
                </li>
                <li className="flex items-start gap-2">
                  <Coffee size={16} className="text-[#003B95] mt-0.5" />
                  Great dining options on-site
                </li>
                <li className="flex items-start gap-2">
                  <Car size={16} className="text-[#003B95] mt-0.5" />
                  Free private parking available at the hotel
                </li>
              </ul>
              <button className="w-full mt-6 py-3 bg-[#003B95] text-white font-bold rounded hover:bg-[#002b6e] transition-colors">
                Reserve your stay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
