import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { ArrowLeft, Save } from "lucide-react";
import { AddressSelector } from "../../components/ui/AddressSelector";

export const HotelForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/hotel-master/categories');
      if (res && res.length > 0) {
        setCategories(res);
      } else {
        setCategories([{id: 1, name: '3 Star'}, {id: 2, name: '4 Star'}, {id: 3, name: '5 Star'}, {id: 4, name: 'Resort'}, {id: 5, name: 'Boutique'}]);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([{id: 1, name: '3 Star'}, {id: 2, name: '4 Star'}, {id: 3, name: '5 Star'}, {id: 4, name: 'Resort'}, {id: 5, name: 'Boutique'}]);
    }
  };

  const handleAddCategory = async () => {
    const newCat = window.prompt("Enter new category name (e.g. 7 Star):");
    if (!newCat || newCat.trim() === "") return;
    try {
      await api.post('/hotel-master/categories', { name: newCat.trim() });
      await fetchCategories();
      setFormData(prev => ({ ...prev, hotelCategory: newCat.trim() }));
    } catch (err) {
      console.error("Failed to add category", err);
      alert("Failed to add category. It may already exist.");
    }
  };

  const [formData, setFormData] = useState({
    hotelName: "",
    hotelCategory: "3 Star",
    description: "",
    email: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    website: "",
    country: "",
    state: "",
    city: "",
    area: "",
    landmark: "",
    pincode: "",
    hasSwimmingPool: false,
    hasSpa: false,
    hasGym: false,
    hasParking: false,
    hasAirportPickup: false,
    hasFreeWiFi: false
  });

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/hotel-master", formData);
      navigate("/hotel-master");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/hotel-master")} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Add New Hotel</h1>
          <p className="text-gray-500 mt-1">Register a new property into the master database.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hotel Name *</label>
              <input required name="hotelName" value={formData.hotelName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-gray-700">Category</label>
                <button type="button" onClick={handleAddCategory} className="text-xs text-primary font-bold hover:underline">
                  + Add New
                </button>
              </div>
              <select name="hotelCategory" value={formData.hotelCategory} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input required minLength={10} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
              <input name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"></textarea>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Address</h3>
          <div className="space-y-5">
            <AddressSelector 
              countryName={formData.country}
              stateName={formData.state}
              cityName={formData.city}
              onChange={handleAddressChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode *</label>
                <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Area / Landmark</label>
                <input name="area" value={formData.area} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Amenities & Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" name="hasSwimmingPool" checked={formData.hasSwimmingPool} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary/20" />
              Swimming Pool
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" name="hasSpa" checked={formData.hasSpa} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary/20" />
              Spa
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" name="hasGym" checked={formData.hasGym} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary/20" />
              Gym
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" name="hasParking" checked={formData.hasParking} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary/20" />
              Parking
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" name="hasAirportPickup" checked={formData.hasAirportPickup} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary/20" />
              Airport Pickup
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input type="checkbox" name="hasFreeWiFi" checked={formData.hasFreeWiFi} onChange={handleChange} className="w-4 h-4 text-primary rounded focus:ring-primary/20" />
              Free WiFi
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate("/hotel-master")} className="px-6 py-3 font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-3 flex items-center gap-2 font-bold text-white bg-primary rounded-xl hover:bg-blue-800 transition disabled:opacity-50">
            {loading ? "Saving..." : <><Save size={18} /> Save Property</>}
          </button>
        </div>

      </form>
    </div>
  );
};
