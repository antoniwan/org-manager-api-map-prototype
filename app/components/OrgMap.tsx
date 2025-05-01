"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Organization, Category } from "../data/mockOrgs";
import CategoryIcon from "./CategoryIcon";
import { renderToString } from "react-dom/server";

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

    console.log("Initializing map with data:", {
      organizations,
      selectedCategories,
    });

    // Dynamically import Leaflet
    import("leaflet")
      .then((L) => {
        console.log("Leaflet imported successfully");

        // Initialize map if it hasn't been initialized
        if (!mapRef.current) {
          console.log("Creating new map instance");
          mapRef.current = L.map("map", {
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            dragging: true,
            keyboard: true,
            touchZoom: true,
          }).setView([40.7128, -74.006], 13);

          // Use a simpler tile layer
          L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
              maxZoom: 19,
              minZoom: 1,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: "abcd",
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

        console.log("Filtered organizations:", filteredOrgs);

        // Create a bounds object to fit all markers
        const bounds = L.latLngBounds([]);

        filteredOrgs.forEach((org) => {
          console.log("Creating marker for:", org.name, "at:", [
            org.latitude,
            org.longitude,
          ]);

          // Create custom icon with CategoryIcon component
          const locationIcon = L.divIcon({
            className: "custom-marker",
            html: renderToString(
              <div className="p-1 rounded-full shadow-xl">
                <div className="w-14 h-14 rounded-full bg-yellow-400 border-4 border-white flex items-center justify-center">
                  <CategoryIcon
                    category={org.category}
                    className="w-8 h-8 text-white"
                  />
                </div>
              </div>
            ),
            iconSize: [64, 64],
            iconAnchor: [32, 32],
          });

          const marker = L.marker([org.latitude, org.longitude], {
            icon: locationIcon,
          }).addTo(mapRef.current!).bindPopup(`
          <div class="p-3 max-w-xs">
            <h3 class="font-bold text-lg mb-1">${org.name}</h3>
            <div class="text-sm text-gray-600 mb-2">${org.description}</div>
            <div class="space-y-1 text-sm">
              <div class="flex items-start">
                <span class="text-gray-500 w-20">Address:</span>
                <span class="text-gray-700">${org.address}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-20">Phone:</span>
                <span class="text-gray-700">${org.phone}</span>
              </div>
              <div class="flex items-start">
                <span class="text-gray-500 w-20">Hours:</span>
                <span class="text-gray-700">${org.hours}</span>
              </div>
            </div>
            <div class="mt-2">
              <span class="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">${
                org.category
              }</span>
            </div>
            <div class="mt-2">
              <div class="flex flex-wrap gap-1">
                ${org.services
                  .map(
                    (service) =>
                      `<span class="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">${service}</span>`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `);
          markersRef.current.push(marker);
          bounds.extend([org.latitude, org.longitude]);
        });

        // Fit the map to show all markers if there are any
        if (filteredOrgs.length > 0) {
          console.log("Fitting bounds to show all markers");
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        } else {
          console.log("No markers to show");
        }
      })
      .catch((error) => {
        console.error("Error loading Leaflet:", error);
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
