import axios from 'axios';

export const fetchNearbyHotels = async (params?: Record<string, any>) => {
  const query = params ? new URLSearchParams(params).toString() : '';
  const response = await axios.get(`/api/v1/nearby-hotels${query ? `?${query}` : ''}`);
  return response.data;
};

export const createNearbyHotel = async (data: any) => {
  const response = await axios.post('/api/v1/nearby-hotels', data);
  return response.data;
};

export const updateNearbyHotel = async (id: string, data: any) => {
  const response = await axios.put(`/api/v1/nearby-hotels/${id}`, data);
  return response.data;
};

export const deleteNearbyHotel = async (id: string) => {
  await axios.delete(`/api/v1/nearby-hotels/${id}`);
};
