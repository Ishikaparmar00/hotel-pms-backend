import React from "react";
import { MapPin, Star, Wifi, Coffee, Car, Bath, Map as MapIcon, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const HotelCard = ({ hotel }: { hotel: any }) => {
  const primaryImage = hotel.coverImage || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";
  const numStars = parseInt(hotel.hotelCategory) || 4;

  const totalRoomsAvailable = hotel.roomTypes?.reduce((acc: number, r: any) => acc + r.numberOfRooms, 0) || 0;
  
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Section */}
      <div className="md:w-2/5 relative">
        <img src={primaryImage} alt={hotel.hotelName} className="h-full w-full object-cover min-h-[260px] md:min-h-full" />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors">
          <Heart size={20} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-gray-900">{hotel.hotelName}</h3>
              <span className="flex text-yellow-400">
                {Array.from({ length: numStars }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </span>
            </div>
            
            <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-2">
              <MapPin size={16} className="text-blue-500" /> 
              <span className="font-medium text-gray-800">{hotel.area}, {hotel.city}</span>
              <span>•</span>
              <span className="text-gray-500">{hotel.landmark}</span>
            </div>

            {hotel.distance !== null && hotel.distance !== undefined && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100 mb-3">
                <MapIcon size={14} />
                {hotel.distance.toFixed(1)} km from searched location
              </div>
            )}
          </div>

          {/* Rating Box */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-bold text-gray-900 text-sm">
                  {hotel.hotelRating >= 4.5 ? "Exceptional" : "Very Good"}
                </p>
                <p className="text-gray-500 text-xs">{hotel.totalReviews} reviews</p>
              </div>
              <div className="bg-orange-600 text-white font-bold text-lg p-2 rounded-t-lg rounded-br-lg rounded-bl-sm">
                {hotel.hotelRating.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Details Grid */}
        <div className="grid grid-cols-2 gap-4 my-4">
          {/* Amenities & Rooms */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Highlights</h4>
            <div className="flex flex-wrap gap-2">
              {hotel.hasFreeWiFi && <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"><Wifi size={12}/> WiFi</span>}
              {hotel.hasSwimmingPool && <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"><Bath size={12}/> Pool</span>}
              {hotel.hasParking && <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"><Car size={12}/> Parking</span>}
              {hotel.restaurants?.length > 0 && <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"><Coffee size={12}/> Dining</span>}
            </div>
            
            {hotel.roomTypes?.length > 0 && (
              <div className="mt-3 text-sm text-gray-700">
                <span className="font-semibold">{hotel.roomTypes.length}</span> Room Types • <span className="font-semibold text-green-600">{totalRoomsAvailable}</span> Rooms Available
              </div>
            )}
          </div>

          {/* Restaurant Info (If any) */}
          {hotel.restaurants && hotel.restaurants.length > 0 && (
            <div className="border-l border-gray-100 pl-4">
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Dining Spotlight</h4>
               <div className="text-sm">
                 <p className="font-semibold text-gray-900 truncate">{hotel.restaurants[0].restaurantName}</p>
                 <p className="text-gray-600 text-xs mt-0.5">{hotel.restaurants[0].cuisine} • {hotel.restaurants[0].restaurantType}</p>
                 <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${hotel.restaurants[0].foodType === 'Veg Only' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                   {hotel.restaurants[0].foodType}
                 </span>
               </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-100">
          <div className="flex gap-2">
            <Link to={`/hotel/${hotel.id}`} className="px-4 py-2 text-sm font-semibold border border-orange-600 text-orange-600 rounded hover:bg-orange-50 transition-colors flex items-center gap-2">
              View Details <ExternalLink size={16} />
            </Link>
            <button className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
              View on Map <MapIcon size={16} />
            </button>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Starting from</p>
            <p className="text-2xl font-bold text-gray-900">₹{hotel.startingPrice ? hotel.startingPrice.toLocaleString() : "N/A"}</p>
            <Link to={`/hotel/${hotel.id}`} className="inline-block mt-2 px-6 py-2.5 text-sm font-bold bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors shadow-sm hover:shadow-md">
              Check Availability
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
