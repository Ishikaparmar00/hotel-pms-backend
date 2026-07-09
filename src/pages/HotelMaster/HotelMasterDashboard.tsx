import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { Building, Plus, Search, MapPin, Grid, Download } from "lucide-react";

export const HotelMasterDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async (query = "") => {
    setLoading(true);
    try {
      const [statsRes, hotelsRes] = await Promise.all([
        api.get("/hotel-master/dashboard"),
        api.get(`/hotel-master?search=${query}`)
      ]);
      setStats(statsRes);
      setHotels(hotelsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(searchQuery);
  };

  const handleExportCSV = () => {
    const headers = "Code,Name,Category,Rooms,RoomTypes,Restaurants,City\n";
    const rows = hotels.map(h => `${h.hotelCode},"${h.hotelName}",${h.hotelCategory},${h.totalRooms},${h.totalRoomTypes},${h.totalRestaurants},"${h.city}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hotels_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Hotel Master</h1>
          <p className="text-gray-500 mt-1">Manage all your hotel properties, room types, and restaurants from one place.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            <Download size={16} /> Export CSV
          </button>
          <Link to="/hotel-master/add" className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-800 transition">
            <Plus size={16} /> Add Hotel
          </Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Total Hotels</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalHotels}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Building size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Total Rooms</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalRooms}</div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><Grid size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Room Types</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalRoomTypes}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Grid size={24} /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Total Restaurants</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalRestaurants}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl text-orange-600"><MapPin size={24} /></div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-semibold text-gray-900">Registered Properties</h2>
          <form onSubmit={handleSearch} className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold">Code</th>
                <th className="p-4 font-semibold">Hotel Name</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Rooms</th>
                <th className="p-4 font-semibold">Restaurants</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading hotels...</td></tr>
              ) : hotels.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No hotels found.</td></tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs font-semibold text-gray-600">{hotel.hotelCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{hotel.hotelName}</div>
                      <div className="text-xs text-gray-500">{hotel.email}</div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {hotel.city}, {hotel.state}
                    </td>
                    <td className="p-4">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                        {hotel.hotelCategory}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">{hotel.totalRooms}</td>
                    <td className="p-4 font-semibold text-gray-900">{hotel.totalRestaurants}</td>
                    <td className="p-4 text-right">
                      <Link 
                        to={`/hotel-master/${hotel.id}`}
                        className="text-primary font-bold hover:underline text-sm"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
