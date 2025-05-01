"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Organization, Category } from "../data/mockOrgs";
import CategoryIcon from "./CategoryIcon";
import { renderToString } from "react-dom/server";
import { useLocation } from "../contexts/LocationContext";
import type L from "leaflet";

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
  const { location } = useLocation();
  const [isMapReady, setIsMapReady] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // First effect: Load Leaflet and initialize map
  useEffect(() => {
    let mounted = true;

    const loadLeaflet = async () => {
      if (typeof window === "undefined") return;

      try {
        console.log("Loading Leaflet...");
        const L = await import("leaflet");
        if (!mounted) return;

        console.log("Leaflet loaded successfully");
        setLeafletLoaded(true);
      } catch (error) {
        console.error("Error loading Leaflet:", error);
      }
    };

    loadLeaflet();

    return () => {
      mounted = false;
    };
  }, []);

  // Second effect: Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!leafletLoaded) return;

    const initMap = async () => {
      try {
        console.log("Starting map initialization...");
        const L = await import("leaflet");

        // Ensure the map container exists
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
          console.error("Map container not found");
          return;
        }

        // Clear any existing map instance
        if (mapRef.current) {
          console.log("Cleaning up existing map instance");
          mapRef.current.remove();
          mapRef.current = null;
        }

        console.log("Creating new map instance with location:", location);
        const initialCenter: L.LatLngExpression = location
          ? [location.latitude, location.longitude]
          : [40.7128, -74.006];

        mapRef.current = L.map("map", {
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          dragging: true,
          keyboard: true,
          touchZoom: true,
        }).setView(initialCenter, 13);

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

        // Wait a bit for the map to be fully rendered
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (mapRef.current) {
          mapRef.current.invalidateSize();
          console.log("Map initialized successfully");
          setIsMapReady(true);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setIsMapReady(false);
      }
    };
  }, [leafletLoaded, location]);

  // Third effect: Handle markers
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !leafletLoaded) {
      console.log("Skipping marker update - conditions not met:", {
        isMapReady,
        hasMap: !!mapRef.current,
        leafletLoaded,
      });
      return;
    }

    const updateMarkers = async () => {
      try {
        console.log("Updating markers with:", {
          organizationsCount: organizations.length,
          selectedCategories,
          hasLocation: !!location,
        });

        const L = await import("leaflet");

        // Clear existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        const filteredOrgs = organizations.filter((org) =>
          selectedCategories.includes(org.category)
        );

        console.log(`Found ${filteredOrgs.length} organizations to display`);

        const bounds = L.latLngBounds([]);

        if (location) {
          console.log("Adding user location marker at:", [
            location.latitude,
            location.longitude,
          ]);
          const userIcon = L.divIcon({
            className: "custom-marker",
            html: renderToString(
              <div className="p-1 rounded-full shadow-xl">
                <div className="w-14 h-14 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white"></div>
                </div>
              </div>
            ),
            iconSize: [64, 64],
            iconAnchor: [32, 32],
          });

          const userMarker = L.marker([location.latitude, location.longitude], {
            icon: userIcon,
          }).addTo(mapRef.current);

          bounds.extend([location.latitude, location.longitude]);
        }

        filteredOrgs.forEach((org) => {
          console.log(`Adding marker for ${org.name} at:`, [
            org.latitude,
            org.longitude,
          ]);
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

        if (filteredOrgs.length > 0 || location) {
          console.log("Fitting bounds to show all markers");
          mapRef.current.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 13,
          });
        }
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    };

    updateMarkers();
  }, [organizations, selectedCategories, location, isMapReady, leafletLoaded]);

  return (
    <div
      id="map"
      className="w-full h-screen"
      style={{
        minHeight: "400px",
        position: "relative",
        zIndex: 1,
      }}
    />
  );
}
