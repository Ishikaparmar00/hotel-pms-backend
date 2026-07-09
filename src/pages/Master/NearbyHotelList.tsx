import React, { useEffect, useState } from 'react';
import { fetchNearbyHotels, deleteNearbyHotel } from '../../api/nearbyHotel';
import { Link, useNavigate } from 'react-router-dom';

export const NearbyHotelList: React.FC = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadHotels = async () => {
    setLoading(true);
    try {
      const data = await fetchNearbyHotels();
      setHotels(data);
    } catch (e) {
      console.error('Failed to load nearby hotels', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this nearby hotel?')) return;
    await deleteNearbyHotel(id);
    loadHotels();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Nearby Hotels Master</h1>
        <Link
          to="/nearby-hotels/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Add Nearby Hotel
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Property</th>
              <th className="p-2 text-left">Stars</th>
              <th className="p-2 text-left">Distance</th>
              <th className="p-2 text-left">Travel Time</th>
              <th className="p-2 text-left">City</th>
              <th className="p-2 text-left">State</th>
              <th className="p-2 text-left">Contact</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr key={hotel.id} className="border-t">
                <td className="p-2">
                  {hotel.thumbnailUrl ? (
                    <img src={hotel.thumbnailUrl} alt="thumb" className="w-16 h-12 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="p-2 font-medium">{hotel.hotelName}</td>
                <td className="p-2">{hotel.property?.name || '—'}</td>
                <td className="p-2">{hotel.starRating}</td>
                <td className="p-2">{hotel.distance} km</td>
                <td className="p-2">{hotel.travelTime}</td>
                <td className="p-2">{hotel.city}</td>
                <td className="p-2">{hotel.state}</td>
                <td className="p-2">{hotel.contactNumber}</td>
                <td className="p-2">{hotel.status}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => navigate(`/nearby-hotels/edit/${hotel.id}`)}
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hotel.id)}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
