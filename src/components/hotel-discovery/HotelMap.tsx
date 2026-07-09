import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Hotel } from "../../context/HotelDiscoveryContext";

// Fix leaflet marker icon issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ChangeView = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const HotelMap = ({ hotels }: { hotels: Hotel[] }) => {
  if (!hotels || hotels.length === 0) return <div className="h-full bg-gray-100 flex items-center justify-center rounded-xl border border-gray-200">No hotels to display on map</div>;

  const defaultCenter: [number, number] = [hotels[0].latitude, hotels[0].longitude];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <ChangeView center={defaultCenter} zoom={13} />
        
        {hotels.map((hotel) => (
          <Marker key={hotel.id} position={[hotel.latitude, hotel.longitude]}>
            <Popup>
              <div className="font-sans">
                <h4 className="font-bold text-sm m-0 leading-tight">{hotel.name}</h4>
                <div className="text-[#4F46E5] font-bold mt-1">₹{hotel.basePrice} / night</div>
                <div className="text-xs text-gray-500 mt-1">⭐ {hotel.averageRating} ({hotel.totalReviews})</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
