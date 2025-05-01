"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
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

    // Initialize map if it hasn't been initialized
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([40.7128, -74.006], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [organizations, selectedCategories]);

  return <div id="map" className="w-full h-screen" />;
}
