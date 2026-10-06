import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Contact, Survey } from '../types';
import { DEMO_CONTACTS } from '../demoFixtureData';
import { MapPin, Navigation, Info } from 'lucide-react';

interface MapViewProps {
  surveys: Survey[];
  onSelectSurvey: (surveyId: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({ surveys, onSelectSurvey }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center: Bay of Bengal off Chennai / NIOT Headquarters (13.0827, 80.2707)
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([13.0827, 80.2707], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors &bull; AQUAFORGE Hydrographic System',
        maxZoom: 18,
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Fetch and plot all contacts from active surveys
    const loadAndPlotContacts = async () => {
      // Clear previous layers
      map.eachLayer((layer) => {
        if (!(layer instanceof L.TileLayer)) {
          map.removeLayer(layer);
        }
      });

      const allCoordinates: [number, number][] = [];

      for (const survey of surveys) {
        let contacts: Contact[] = [];
        try {
          const res = await fetch(`/api/surveys/${survey.id}/contacts`);
          if (res.ok) {
            contacts = await res.json();
          } else {
            contacts = DEMO_CONTACTS as any;
          }
        } catch (e) {
          console.warn("Using demo contacts for MapView:", e);
          contacts = DEMO_CONTACTS as any;
        }

        contacts.forEach((c) => {
            const geo = c.geolocation;
            if (geo && geo.has_metadata && geo.latitude && geo.longitude) {
              const lat = geo.latitude;
              const lon = geo.longitude;
              allCoordinates.push([lat, lon]);

              const markerColor = c.priority_level === 'HIGH' ? '#D90429' :
                                  c.is_novel_anomaly ? '#7209B7' :
                                  c.priority_level === 'MEDIUM' ? '#F77F00' : '#2A9D8F';

              // Uncertainty buffer circle (error envelope radius)
              const uncertaintyM = geo.position_uncertainty_m || 8.0;
              L.circle([lat, lon], {
                radius: uncertaintyM,
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.15,
                weight: 1,
                dashArray: '4, 4'
              }).addTo(map);

              // Target point marker
              const circleMarker = L.circleMarker([lat, lon], {
                radius: 7,
                fillColor: markerColor,
                color: '#FFFFFF',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.95
              }).addTo(map);

              // Popup content with acoustic evidence
              const popupContent = `
                <div style="font-family: 'Inter', sans-serif; font-size: 12px; min-width: 200px;">
                  <div style="font-weight: 800; font-size: 13px; color: #0B192C;">${c.contact_code}: ${c.detected_class}</div>
                  <div style="color: #6C757D; font-size: 11px; margin-bottom: 6px;">${survey.name}</div>
                  <div style="margin: 4px 0;"><strong>Acoustic:</strong> ${c.acoustic_hypothesis}</div>
                  <div style="margin: 4px 0;"><strong>Confidence:</strong> ${Math.round(c.calibrated_confidence * 100)}% (${c.calibration_status})</div>
                  <div style="margin: 4px 0;"><strong>Priority:</strong> <span style="color: ${markerColor}; font-weight: bold;">${c.priority_level}</span></div>
                  <div style="margin: 4px 0;"><strong>Error:</strong> &plusmn;${uncertaintyM}m</div>
                  <div style="margin-top: 8px; font-size: 11px; color: #1E3E62;">
                    <strong>Next Action:</strong> ${c.recommendation?.recommended_action || 'Standard pass'}
                  </div>
                </div>
              `;
              circleMarker.bindPopup(popupContent);
            }
          });
      }

      if (allCoordinates.length > 0) {
        const bounds = L.latLngBounds(allCoordinates);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    };

    loadAndPlotContacts();

  }, [surveys]);

  return (
    <div className="space-y-4">
      
      {/* Map Control Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-700" />
            Geospatial Survey Intelligence & Benthic Debris Mapping
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            WGS-84 geodesic projections with dynamic uncertainty envelopes and acoustic priority tagging
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center text-gray-700">
            <span className="w-3 h-3 rounded-full bg-[#D90429] mr-1.5"></span>
            High Priority Debris
          </span>
          <span className="flex items-center text-gray-700">
            <span className="w-3 h-3 rounded-full bg-[#F77F00] mr-1.5"></span>
            Medium Priority
          </span>
          <span className="flex items-center text-gray-700">
            <span className="w-3 h-3 rounded-full bg-[#7209B7] mr-1.5"></span>
            Novel Anomaly
          </span>
          <span className="flex items-center text-gray-700">
            <span className="w-3 h-3 rounded-full bg-[#2A9D8F] mr-1.5"></span>
            Low Priority
          </span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs h-[720px] relative">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Navigation Telemetry Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 border border-gray-300 rounded-md p-3 shadow-md text-xs font-mono max-w-xs backdrop-blur-xs">
          <div className="font-bold text-gray-900 flex items-center text-[11px] uppercase tracking-wider mb-1.5">
            <Navigation className="w-3.5 h-3.5 mr-1 text-blue-700" />
            Hydrographic Projection System
          </div>
          <div className="text-[10px] text-gray-600 space-y-0.5">
            <div>Datum: WGS-84 Ellipsoid (EPSG:4326)</div>
            <div>Basemap: OpenStreetMap Open Standard</div>
            <div>Dotted Buffers: &plusmn;&epsilon; Position Uncertainty Error</div>
          </div>
        </div>
      </div>

    </div>
  );
};
