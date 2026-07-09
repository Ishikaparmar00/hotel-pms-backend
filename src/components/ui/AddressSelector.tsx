import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { Plus, X } from "lucide-react";

interface AddressSelectorProps {
  countryName: string;
  stateName: string;
  cityName: string;
  onChange: (field: string, name: string) => void;
}

export const AddressSelector: React.FC<AddressSelectorProps> = ({ countryName, stateName, cityName, onChange }) => {
  const queryClient = useQueryClient();

  // Internal state to hold selected IDs so we can query dependencies
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  // Queries
  const { data: countries = [], isLoading: loadingCountries } = useQuery({
    queryKey: ['countries'],
    queryFn: () => api.get('/address/countries')
  });

  const { data: states = [], isLoading: loadingStates } = useQuery({
    queryKey: ['states', selectedCountryId],
    queryFn: () => api.get(`/address/states?countryId=${selectedCountryId}`),
    enabled: !!selectedCountryId
  });

  const { data: cities = [], isLoading: loadingCities } = useQuery({
    queryKey: ['cities', selectedStateId],
    queryFn: () => api.get(`/address/cities?stateId=${selectedStateId}`),
    enabled: !!selectedStateId
  });

  // Handlers
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    const id = e.target.options[e.target.selectedIndex].getAttribute('data-id');
    
    onChange("country", name);
    onChange("state", "");
    onChange("city", "");
    
    setSelectedCountryId(id ? parseInt(id) : null);
    setSelectedStateId(null);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    const id = e.target.options[e.target.selectedIndex].getAttribute('data-id');
    
    onChange("state", name);
    onChange("city", "");
    
    setSelectedStateId(id ? parseInt(id) : null);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    onChange("city", name);
  };

  // Add Item Logic
  const handleAddCountry = async () => {
    const name = window.prompt("Enter new country name:");
    if (!name || name.trim() === "") return;
    try {
      const res = await api.post('/address/countries', { name: name.trim() });
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      onChange("country", res.name);
      setSelectedCountryId(res.id);
      onChange("state", "");
      onChange("city", "");
      setSelectedStateId(null);
    } catch (err: any) {
      alert("Failed to add country. It might already exist.");
    }
  };

  const handleAddState = async () => {
    if (!selectedCountryId) return alert("Please select a country first.");
    const name = window.prompt("Enter new state name:");
    if (!name || name.trim() === "") return;
    try {
      const res = await api.post('/address/states', { name: name.trim(), countryId: selectedCountryId });
      queryClient.invalidateQueries({ queryKey: ['states', selectedCountryId] });
      onChange("state", res.name);
      setSelectedStateId(res.id);
      onChange("city", "");
    } catch (err: any) {
      alert("Failed to add state.");
    }
  };

  const handleAddCity = async () => {
    if (!selectedStateId) return alert("Please select a state first.");
    const name = window.prompt("Enter new city name:");
    if (!name || name.trim() === "") return;
    try {
      const res = await api.post('/address/cities', { name: name.trim(), stateId: selectedStateId });
      queryClient.invalidateQueries({ queryKey: ['cities', selectedStateId] });
      onChange("city", res.name);
    } catch (err: any) {
      alert("Failed to add city.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* COUNTRY */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-semibold text-gray-700">Country *</label>
          <button type="button" onClick={handleAddCountry} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
            <Plus size={12}/> Add Country
          </button>
        </div>
        <select 
          required 
          name="country" 
          value={countryName || ""} 
          onChange={handleCountryChange} 
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white"
        >
          <option value="" disabled>-- Select Country --</option>
          {loadingCountries ? <option disabled>Loading...</option> : null}
          {countries.map((c: any) => (
            <option key={c.id} data-id={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* STATE */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-semibold text-gray-700">State *</label>
          {selectedCountryId && (
            <button type="button" onClick={handleAddState} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
              <Plus size={12}/> Add State
            </button>
          )}
        </div>
        <select 
          required 
          name="state" 
          value={stateName || ""} 
          onChange={handleStateChange} 
          disabled={!selectedCountryId}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="" disabled>-- Select State --</option>
          {loadingStates ? <option disabled>Loading...</option> : null}
          {states.map((s: any) => (
            <option key={s.id} data-id={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* CITY */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-semibold text-gray-700">City *</label>
          {selectedStateId && (
            <button type="button" onClick={handleAddCity} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1">
              <Plus size={12}/> Add City
            </button>
          )}
        </div>
        <select 
          required 
          name="city" 
          value={cityName || ""} 
          onChange={handleCityChange} 
          disabled={!selectedStateId}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
        >
          <option value="" disabled>-- Select City --</option>
          {loadingCities ? <option disabled>Loading...</option> : null}
          {cities.map((c: any) => (
            <option key={c.id} data-id={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
