"use client";
import { MapPin } from 'lucide-react';
import React, { useEffect, useState } from "react";
import type { Event } from "@/lib/events";
import { CITY_COORDS } from "@/features/geo/cities";

interface EventMapProps {
  events: Event[];
  center?: { lat: number; lon: number };
  zoom?: number;
  onEventClick?: (eventId: string) => void;
}

export default function EventMap({ events, center, zoom = 11, onEventClick }: EventMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapComponents, setMapComponents] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
    
    // Import Leaflet and react-leaflet components
    Promise.all([
      import("leaflet"),
      import("react-leaflet")
    ]).then(([leaflet, reactLeaflet]) => {
      setL(leaflet.default);
      setMapComponents({
        MapContainer: reactLeaflet.MapContainer,
        TileLayer: reactLeaflet.TileLayer,
        Marker: reactLeaflet.Marker,
        Popup: reactLeaflet.Popup,
      });
      
      // Fix default marker icon issue with webpack
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    }).catch((error) => {
      console.error("Failed to load map libraries:", error);
    });
  }, []);

  // Update map when center changes
  useEffect(() => {
    if (center) {
      setMapKey(prev => prev + 1);
    }
  }, [center]);

  // Calculate center from events if not provided
  const mapCenter = center || (events.length > 0 && events[0].city in CITY_COORDS
    ? CITY_COORDS[events[0].city as keyof typeof CITY_COORDS]
    : { lat: 6.5244, lon: 3.3792 }); // Default to Lagos

  // Group events by location for clustering
  const eventsByLocation = React.useMemo(() => {
    const grouped = new Map<string, Event[]>();
    
    events.forEach((event) => {
      if (event.city in CITY_COORDS) {
        const coords = CITY_COORDS[event.city as keyof typeof CITY_COORDS];
        const key = `${coords.lat},${coords.lon}`;
        
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)!.push(event);
      }
    });
    
    return grouped;
  }, [events]);

  if (!isClient || !L || !mapComponents) {
    return (
      <div className="h-[500px] w-full rounded-2xl bg-white border border-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-slate-500">Loading map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = mapComponents;

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      <MapContainer
        key={mapKey}
        center={[mapCenter.lat, mapCenter.lon]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {Array.from(eventsByLocation.entries()).map(([key, locationEvents]) => {
          const [lat, lon] = key.split(",").map(Number);
          const eventCount = locationEvents.length;
          
          // Create custom icon for clustered markers
          const icon = eventCount > 1 ? new L.DivIcon({
            html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-bold shadow-lg border-2 border-white">${eventCount}</div>`,
            className: "custom-cluster-icon",
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          }) : undefined;
          
          return (
            <Marker
              key={key}
              position={[lat, lon]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (locationEvents.length === 1 && onEventClick) {
                    onEventClick(locationEvents[0].id);
                  }
                },
              }}
            >
              <Popup maxWidth={300}>
                <div className="p-2">
                  {eventCount > 1 ? (
                    <>
                      <h3 className="font-semibold text-sm mb-2">
                        {eventCount} events in {locationEvents[0].city}
                      </h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {locationEvents.map((event) => (
                          <div
                            key={event.id}
                            className="border-b border-slate-200 pb-2 last:border-0 cursor-pointer hover:bg-slate-50 p-1 rounded"
                            onClick={() => onEventClick?.(event.id)}
                          >
                            <p className="font-medium text-xs">{event.title}</p>
                            <p className="text-xs text-slate-600">{event.date}</p>
                            <p className="text-xs text-slate-500">{event.category}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-sm mb-1">{locationEvents[0].title}</h3>
                      <p className="text-xs text-slate-600 mb-1">{locationEvents[0].description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{locationEvents[0].date}</span>
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-medium">
                          {locationEvents[0].category}
                        </span>
                      </div>
                      {locationEvents[0].venue && (
                        <p className="text-xs text-slate-500 mt-1">MapPin {locationEvents[0].venue}</p>
                      )}
                      <button
                        onClick={() => onEventClick?.(locationEvents[0].id)}
                        className="mt-2 w-full text-xs bg-primary-600 text-white py-1 px-2 rounded hover:bg-primary-700 transition-colors"
                      >
                        View Details
                      </button>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
