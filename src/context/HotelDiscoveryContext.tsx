import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../services/api";

export interface HotelRoom {
  id: number;
  roomType: string;
  remainingRooms: number;
  currentPrice: number;
  occupancyPercent: number;
}

export interface HotelAmenity {
  id: number;
  name: string;
  category: string;
}

export interface Hotel {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  email: string;
  starRating: number;
  averageRating: number;
  totalReviews: number;
  basePrice: number;
  availableRooms: number;
  totalRooms: number;
  description: string;
  totalScore: number;
  badges: string[];
  amenities: HotelAmenity[];
  rooms: HotelRoom[];
  images: { id: number, url: string, caption: string, isPrimary: boolean }[];
}

interface DiscoveryContextType {
  hotels: Hotel[];
  loading: boolean;
  filters: any;
  setFilters: (f: any) => void;
  searchHotels: (query?: any) => void;
  compareHotels: (ids: number[]) => void;
}

const HotelDiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const HotelDiscoveryProvider = ({ children }: { children: ReactNode }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.IO for real-time room availability
    const newSocket = io("http://localhost:5001");
    setSocket(newSocket);

    newSocket.on("roomAvailabilityUpdate", (data) => {
      console.log("Real-time room update:", data);
      // Example: update the specific hotel's room availability in state
      setHotels((prev) =>
        prev.map((h) => {
          if (h.id === data.hotelId) {
            return { ...h, rooms: data.roomsData };
          }
          return h;
        })
      );
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const searchHotels = async (query = {}) => {
    setLoading(true);
    try {
      // Build query string
      const qs = new URLSearchParams(query).toString();
      const res = await api.get(`/hotel-discovery/search?${qs}`);
      setHotels(res);
    } catch (err) {
      console.error("Error fetching hotels", err);
    } finally {
      setLoading(false);
    }
  };

  const compareHotels = async (ids: number[]) => {
    const res = await api.get(`/hotel-discovery/compare?ids=${ids.join(",")}`);
    console.log("Comparison Data", res);
  };

  useEffect(() => {
    searchHotels(filters);
  }, [filters]);

  return (
    <HotelDiscoveryContext.Provider value={{ hotels, loading, filters, setFilters, searchHotels, compareHotels }}>
      {children}
    </HotelDiscoveryContext.Provider>
  );
};

export const useHotelDiscovery = () => {
  const context = useContext(HotelDiscoveryContext);
  if (!context) throw new Error("useHotelDiscovery must be used within Provider");
  return context;
};
