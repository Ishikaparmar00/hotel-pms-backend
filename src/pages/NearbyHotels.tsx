import React, { useState, useEffect } from "react";
import { HotelCard } from "../components/hotel-discovery/HotelCard";
import { Search, Map as MapIcon, List, Filter } from "lucide-react";
import { api } from "../services/api";

export const NearbyHotels = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  
  const [searchParams, setSearchParams] = useState({
    destination: "Goa",
    lat: "15.5553", // Mocking Goa center
    lng: "73.7517", // Mocking Goa center
    minPrice: "",
    maxPrice: "50000",
    foodType: "",
    amenities: {
      hasSwimmingPool: false,
      hasFreeWiFi: false,
      hasRoomService: false,
      hasSpa: false
    }
  });

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const activeAmenities = Object.entries(searchParams.amenities)
        .filter(([_, isActive]) => isActive)
        .map(([key]) => key)
        .join(",");

      const queryParams = new URLSearchParams();
      if (searchParams.destination) queryParams.append("destination", searchParams.destination);
      if (searchParams.lat) queryParams.append("lat", searchParams.lat);
      if (searchParams.lng) queryParams.append("lng", searchParams.lng);
      if (searchParams.maxPrice) queryParams.append("maxPrice", searchParams.maxPrice);
      if (searchParams.foodType) queryParams.append("foodType", searchParams.foodType);
      if (activeAmenities) queryParams.append("amenities", activeAmenities);

      const response = await api.get(`/hotel-master/search?${queryParams.toString()}`);
      setHotels(response);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []); // Initial load

  const handleAmenityChange = (key: string) => {
    setSearchParams(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !(prev.amenities as any)[key]
      }
    }));
  };

  // Simple Analytics Widgets calculation
  const totalHotels = hotels.length;
  const avgPrice = totalHotels ? hotels.reduce((acc, h) => acc + h.startingPrice, 0) / totalHotels : 0;
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#003B95] tracking-tight mb-1">Find your next stay</h1>
        <p className="text-gray-600">Search low prices on hotels, homes and much more...</p>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[700px]">
        {/* Filters Sidebar */}
        <div className="w-1/4 bg-white rounded-xl shadow border border-gray-200 p-5 overflow-y-auto">
          <div className="flex items-center gap-2 font-bold text-gray-900 mb-4 pb-4 border-b border-gray-100">
            <Filter size={18} /> Search & Filters
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Destination / City</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  value={searchParams.destination}
                  onChange={e => setSearchParams({...searchParams, destination: e.target.value})}
                  placeholder="e.g. Goa, India" 
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#003B95] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Max Budget (₹/night)</label>
              <input 
                type="range" 
                className="w-full accent-orange-600" 
                min="1000" 
                max="50000" 
                step="500"
                value={searchParams.maxPrice}
                onChange={e => setSearchParams({...searchParams, maxPrice: e.target.value})}
              />
              <div className="flex justify-between text-xs font-semibold text-gray-600 mt-1">
                <span>₹1,000</span>
                <span>₹{parseInt(searchParams.maxPrice).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Food Type (Restaurants)</label>
              <select 
                value={searchParams.foodType}
                onChange={e => setSearchParams({...searchParams, foodType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
              >
                <option value="">Any</option>
                <option value="Veg Only">Veg Only</option>
                <option value="Non-Veg Only">Non-Veg Only</option>
                <option value="Veg & Non-Veg">Veg & Non-Veg</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Popular Filters</label>
              <div className="space-y-3 text-sm font-medium text-gray-700">
                {Object.keys(searchParams.amenities).map(key => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer hover:text-orange-600 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600" 
                      checked={(searchParams.amenities as any)[key]}
                      onChange={() => handleAmenityChange(key)}
                    /> 
                    {key.replace('has', '').replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={fetchHotels}
              className="w-full bg-orange-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-orange-700 transition-colors mt-4 shadow-sm"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 flex flex-col h-full bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="font-bold text-xl text-gray-900">{searchParams.destination || 'All Destinations'}: {totalHotels} properties found</h2>
              <p className="text-sm text-gray-600 mt-1">Avg. price: ₹{avgPrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 bg-gray-100 relative">
            {loading ? (
              <div className="flex h-full items-center justify-center font-bold text-gray-500">Searching...</div>
            ) : viewMode === "list" ? (
              <div className="space-y-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
                {hotels.length === 0 && (
                  <div className="text-center text-gray-500 mt-20">
                    <h3 className="text-xl font-bold mb-2">No properties found</h3>
                    <p>Try adjusting your search filters.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full font-bold text-gray-500">
                Map view integration pending...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
