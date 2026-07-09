import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { ArrowLeft, BedDouble, UtensilsCrossed, Plus, Trash2 } from "lucide-react";

export const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"rooms" | "restaurants">("rooms");
  const [loading, setLoading] = useState(true);

  const fetchHotel = async () => {
    try {
      const res = await api.get(`/hotel-master/${id}`);
      setHotel(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const [newRoom, setNewRoom] = useState({ roomTypeName: "", roomTypeCode: "", numberOfRooms: 0, basePrice: 0 });
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/hotel-master/${id}/room-types`, {
      ...newRoom,
      numberOfRooms: parseInt(newRoom.numberOfRooms as any, 10),
      basePrice: parseFloat(newRoom.basePrice as any)
    });
    setNewRoom({ roomTypeName: "", roomTypeCode: "", numberOfRooms: 0, basePrice: 0 });
    fetchHotel();
  };

  const handleDeleteRoom = async (rtId: number) => {
    if (confirm("Are you sure you want to delete this room type?")) {
      await api.delete(`/hotel-master/room-types/${rtId}`);
      fetchHotel();
    }
  };

  const [newRestaurant, setNewRestaurant] = useState({ restaurantName: "", restaurantType: "", foodType: "Veg & Non-Veg", seatingCapacity: 0 });
  const handleAddRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post(`/hotel-master/${id}/restaurants`, {
      ...newRestaurant,
      seatingCapacity: parseInt(newRestaurant.seatingCapacity as any, 10)
    });
    setNewRestaurant({ restaurantName: "", restaurantType: "", foodType: "Veg & Non-Veg", seatingCapacity: 0 });
    fetchHotel();
  };

  const handleDeleteRestaurant = async (rId: number) => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      await api.delete(`/hotel-master/restaurants/${rId}`);
      fetchHotel();
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading hotel details...</div>;
  if (!hotel) return <div className="p-10 text-center text-red-500">Hotel not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/hotel-master")} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{hotel.hotelName}</h1>
          <p className="text-gray-500 font-mono text-sm mt-1">{hotel.hotelCode} • {hotel.city}, {hotel.country}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-indigo-900">
          <div className="text-sm font-semibold opacity-70">Total Rooms</div>
          <div className="text-2xl font-bold mt-1">{hotel.totalRooms}</div>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-purple-900">
          <div className="text-sm font-semibold opacity-70">Room Types</div>
          <div className="text-2xl font-bold mt-1">{hotel.totalRoomTypes}</div>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-orange-900">
          <div className="text-sm font-semibold opacity-70">Restaurants</div>
          <div className="text-2xl font-bold mt-1">{hotel.totalRestaurants}</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="flex border-b border-gray-100 bg-gray-50">
          <button 
            onClick={() => setActiveTab("rooms")}
            className={`flex-1 py-4 flex justify-center items-center gap-2 font-bold transition ${activeTab === 'rooms' ? 'text-primary bg-white border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BedDouble size={20} /> Room Type Management
          </button>
          <button 
            onClick={() => setActiveTab("restaurants")}
            className={`flex-1 py-4 flex justify-center items-center gap-2 font-bold transition ${activeTab === 'restaurants' ? 'text-primary bg-white border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <UtensilsCrossed size={20} /> Restaurant Management
          </button>
        </div>

        <div className="p-6">
          {activeTab === "rooms" ? (
            <div className="space-y-6">
              <form onSubmit={handleAddRoom} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Room Type Name</label>
                  <input required value={newRoom.roomTypeName} onChange={e=>setNewRoom({...newRoom, roomTypeName: e.target.value})} placeholder="e.g. Deluxe Sea View" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Code</label>
                  <input required value={newRoom.roomTypeCode} onChange={e=>setNewRoom({...newRoom, roomTypeCode: e.target.value})} placeholder="DLX" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Rooms</label>
                  <input type="number" min="0" required value={newRoom.numberOfRooms} onChange={e=>setNewRoom({...newRoom, numberOfRooms: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Base Price</label>
                  <input type="number" min="0" required value={newRoom.basePrice} onChange={e=>setNewRoom({...newRoom, basePrice: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <button type="submit" className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#4338CA]">
                  <Plus size={16} /> Add
                </button>
              </form>

              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Total Rooms</th>
                    <th className="p-3">Base Price</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {hotel.roomTypes.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-gray-500">No room types configured.</td></tr>
                  ) : (
                    hotel.roomTypes.map((rt: any) => (
                      <tr key={rt.id}>
                        <td className="p-3 font-bold text-gray-900">{rt.roomTypeName}</td>
                        <td className="p-3 font-mono text-gray-500">{rt.roomTypeCode}</td>
                        <td className="p-3">{rt.numberOfRooms}</td>
                        <td className="p-3">₹{rt.basePrice}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleDeleteRoom(rt.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-6">
               <form onSubmit={handleAddRestaurant} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Restaurant Name</label>
                  <input required value={newRestaurant.restaurantName} onChange={e=>setNewRestaurant({...newRestaurant, restaurantName: e.target.value})} placeholder="e.g. Ocean View Diner" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type/Cuisine</label>
                  <input required value={newRestaurant.restaurantType} onChange={e=>setNewRestaurant({...newRestaurant, restaurantType: e.target.value})} placeholder="Fine Dining / Seafood" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Food Type</label>
                  <select required value={newRestaurant.foodType} onChange={e=>setNewRestaurant({...newRestaurant, foodType: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option>Veg Only</option>
                    <option>Non-Veg Only</option>
                    <option>Veg & Non-Veg</option>
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Capacity</label>
                  <input type="number" min="0" required value={newRestaurant.seatingCapacity} onChange={e=>setNewRestaurant({...newRestaurant, seatingCapacity: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <button type="submit" className="bg-[#4F46E5] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#4338CA]">
                  <Plus size={16} /> Add
                </button>
              </form>

              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="p-3">Restaurant Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Food Type</th>
                    <th className="p-3">Capacity</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {hotel.restaurants.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">No restaurants configured.</td></tr>
                  ) : (
                    hotel.restaurants.map((r: any) => (
                      <tr key={r.id}>
                        <td className="p-3 font-bold text-gray-900">{r.restaurantName}</td>
                        <td className="p-3 text-gray-600">{r.restaurantType}</td>
                        <td className="p-3 text-gray-600 font-semibold">{r.foodType}</td>
                        <td className="p-3">{r.seatingCapacity}</td>
                        <td className="p-3 text-right">
                          <button onClick={() => handleDeleteRestaurant(r.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
