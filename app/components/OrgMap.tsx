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
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          dragging: true,
          keyboard: false,
          touchZoom: false,
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

      // Add markers for filtered organizations
      const filteredOrgs = organizations.filter((org) =>
        selectedCategories.includes(org.category)
      );

      filteredOrgs.forEach((org) => {
        const marker = L.marker([org.latitude, org.longitude]).addTo(
          mapRef.current!
        ).bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${org.name}</h3>
            <p class="text-sm">${org.description}</p>
            <span class="text-xs text-gray-500">${org.category}</span>
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
