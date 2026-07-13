"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cities = [
  { name: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, events: "12,400+", tagline: "Cultural capital" },
  { name: "Abuja", country: "Nigeria", lat: 9.0765, lng: 7.3986, events: "5,200+", tagline: "Political hub" },
  { name: "Port Harcourt", country: "Nigeria", lat: 4.8156, lng: 7.0498, events: "3,100+", tagline: "Garden city" },
  { name: "Accra", country: "Ghana", lat: 5.6037, lng: -0.187, events: "8,700+", tagline: "Creative city" },
  { name: "Kumasi", country: "Ghana", lat: 6.6885, lng: -1.6244, events: "2,400+", tagline: "Ashanti capital" },
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, events: "6,800+", tagline: "Tech hub" },
  { name: "Mombasa", country: "Kenya", lat: -4.0435, lng: 39.6682, events: "1,900+", tagline: "Coastal gem" },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lng: 18.4241, events: "7,300+", tagline: "Mother city" },
  { name: "Johannesburg", country: "South Africa", lat: -26.2041, lng: 28.0473, events: "5,600+", tagline: "City of gold" },
  { name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, events: "4,200+", tagline: "Ancient meets modern" },
  { name: "Alexandria", country: "Egypt", lat: 31.2001, lng: 29.9187, events: "1,800+", tagline: "Mediterranean jewel" },
];

function createCustomIcon(isActive: boolean) {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-wrapper" style="position: relative;">
        <div style="
          width: ${isActive ? "16px" : "10px"};
          height: ${isActive ? "16px" : "10px"};
          background: ${isActive ? "#c7fd02" : "#001c24"};
          border-radius: 50%;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          transition: all 0.3s ease;
        "></div>
        ${isActive ? `
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 28px;
            height: 28px;
            background: rgba(199, 253, 2, 0.25);
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
        ` : ""}
      </div>
    `,
    iconSize: [isActive ? 16 : 10, isActive ? 16 : 10],
    iconAnchor: [isActive ? 8 : 5, isActive ? 8 : 5],
  });
}

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 4, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function MapSection() {
  const [activeCity, setActiveCity] = useState<(typeof cities)[0] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([5, 20]);

  const handleCityClick = (city: (typeof cities)[0]) => {
    setActiveCity(city);
    setMapCenter([city.lat, city.lng]);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* City List */}
      <div className="lg:col-span-1 space-y-2 max-h-[500px] overflow-y-auto pr-2">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => handleCityClick(city)}
            className={`w-full text-left rounded-xl p-4 transition-all duration-200 ${
              activeCity?.name === city.name
                ? "bg-lime/10 border border-lime/30"
                : "bg-slate-50 border border-transparent hover:border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">{city.name}</h4>
                <p className="text-xs text-slate-500">{city.country} &middot; {city.tagline}</p>
              </div>
              <span className="text-sm font-semibold text-lime">{city.events}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 h-[500px] relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={4}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapController center={mapCenter} />
          {cities.map((city) => (
            <Marker
              key={city.name}
              position={[city.lat, city.lng]}
              icon={createCustomIcon(activeCity?.name === city.name)}
              eventHandlers={{
                click: () => handleCityClick(city),
              }}
            >
              <Popup
                closeButton={false}
                className="custom-popup"
              >
                <div className="text-center font-aeonik">
                  <p className="font-bold text-slate-900 text-base">{city.name}</p>
                  <p className="text-xs text-slate-500">{city.country}</p>
                  <p className="mt-1 text-sm font-semibold text-lime">{city.events} events</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
