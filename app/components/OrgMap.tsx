"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Organization, Category } from "../data/mockOrgs";

interface OrgMapProps {
  organizations: Organization[];
  selectedCategories: Category[];
}

export default function OrgMap({
  organizations,
  selectedCategories,
}: OrgMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      // Initialize map if it hasn't been initialized
      if (!mapRef.current) {
        mapRef.current = L.map("map", {
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          dragging: true,
          keyboard: true,
          touchZoom: true,
        }).setView([40.7128, -74.006], 13);

        // Use a simpler tile layer
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            minZoom: 1,
          }
        ).addTo(mapRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Create custom icon
      const locationIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3B82F6"/>
          </svg>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      // Add markers for filtered organizations
      const filteredOrgs = organizations.filter((org) =>
        selectedCategories.includes(org.category)
      );

      filteredOrgs.forEach((org) => {
        const marker = L.marker([org.latitude, org.longitude], {
          icon: locationIcon,
        }).addTo(mapRef.current!).bindPopup(`
          <div class="p-3">
            <h3 class="font-bold text-lg mb-1">${org.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${org.description}</p>
            <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">${org.category}</span>
          </div>
        `);
        markersRef.current.push(marker);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [organizations, selectedCategories]);

  return <div id="map" className="w-full h-screen" />;
}
