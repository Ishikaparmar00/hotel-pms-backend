import React from 'react';
import { useForm } from 'react-hook-form';
import { createNearbyHotel } from '../../api/nearbyHotel';
import { useNavigate } from 'react-router-dom';

type FormData = {
  hotelName: string;
  propertyId: string;
  starRating: number;
  description?: string;
  // add other fields as needed
};

export const AddNearbyHotel: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await createNearbyHotel(data);
      navigate('/nearby-hotels');
    } catch (e) {
      console.error('Failed to create nearby hotel', e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Nearby Hotel</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hotel Name</label>
          <input
            {...register('hotelName', { required: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.hotelName && <p className="text-red-600 text-sm">Required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Linked Property ID</label>
          <input
            {...register('propertyId', { required: true })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.propertyId && <p className="text-red-600 text-sm">Required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Star Rating</label>
          <input
            type="number"
            {...register('starRating', { required: true, min: 1, max: 5 })}
            className="w-full border rounded px-3 py-2"
          />
          {errors.starRating && <p className="text-red-600 text-sm">1-5 required</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};
