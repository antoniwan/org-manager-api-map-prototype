"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Organization, Category } from "../data/mockOrgs";
import CategoryIcon from "./CategoryIcon";
import { renderToString } from "react-dom/server";
import { useLocation } from "../contexts/LocationContext";
import { toast } from "react-hot-toast";

// Type declarations for Leaflet and marker cluster
declare global {
  interface Window {
    L: any;
  }
}

interface OrgMapProps {
  organizations: Organization[];
  selectedCategories: Category[];
  onOrganizationsChange?: (orgs: Organization[]) => void;
}

export default function OrgMap({
  organizations,
  selectedCategories,
  onOrganizationsChange,
}: OrgMapProps) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const clusterRef = useRef<any>(null);
  const { location } = useLocation();
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastBoundsRef = useRef<string | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMovingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const userMarkerRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || hasInitializedRef.current) return;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet and its plugins only on client side
        const L = (await import("leaflet")).default;
        await import("leaflet.markercluster");

        // Create map instance
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
          console.error("Map container not found");
          return;
        }

        // Clear existing map if any
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Initialize map with default center
        const map = L.map("map", {
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          dragging: true,
          keyboard: true,
          touchZoom: true,
        });

        // Set initial view to user's location if available, otherwise use default
        if (location) {
          map.setView([location.latitude, location.longitude], 13);
        } else {
          map.setView([40.7128, -74.006], 13);
        }

        // Add tile layer
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          {
            maxZoom: 19,
            minZoom: 1,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
          }
        ).addTo(map);

        // Store map reference
        mapRef.current = map;
        setIsMapReady(true);
        hasInitializedRef.current = true;

        // Add user location if available
        if (location) {
          addUserMarker(map, location);
        }

        // Setup map event listeners
        setupMapEventListeners(map);

        // Initial data fetch
        fetchOrganizationsForBounds(map.getBounds());
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        hasInitializedRef.current = false;
        setIsMapReady(false);
      }
    };
  }, [location]);

  const addUserMarker = useCallback(
    (map: any, userLocation: { latitude: number; longitude: number }) => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const L = require("leaflet");
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

      userMarkerRef.current = L.marker(
        [userLocation.latitude, userLocation.longitude],
        {
          icon: userIcon,
        }
      ).addTo(map);
    },
    []
  );

  const setupMapEventListeners = useCallback(
    (map: any) => {
      const toastId = "map-loading";

      const handleMoveStart = () => {
        isMovingRef.current = true;
      };

      const handleMoveEnd = () => {
        isMovingRef.current = false;
        if (!map) return;

        const bounds = map.getBounds();
        const boundsString = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;

        if (lastBoundsRef.current === boundsString) return;
        lastBoundsRef.current = boundsString;

        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }

        toast.loading("Loading locations in this area...", { id: toastId });

        fetchTimeoutRef.current = setTimeout(async () => {
          if (isMovingRef.current) return;

          try {
            setIsLoading(true);
            const response = await fetch(
              `/api/organizations?bounds=${boundsString}`
            );
            const newOrgs = await response.json();
            onOrganizationsChange?.(newOrgs);

            if (newOrgs.length === 0) {
              toast.error("No locations found in this area", { id: toastId });
            } else {
              toast.success(`Found ${newOrgs.length} locations in this area`, {
                id: toastId,
              });
            }
          } catch (error) {
            console.error("Error fetching organizations:", error);
            toast.error("Failed to load locations", { id: toastId });
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      };

      map.on("movestart", handleMoveStart);
      map.on("moveend", handleMoveEnd);

      return () => {
        map.off("movestart", handleMoveStart);
        map.off("moveend", handleMoveEnd);
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
        toast.dismiss(toastId);
      };
    },
    [onOrganizationsChange]
  );

  const fetchOrganizationsForBounds = useCallback(
    async (bounds: any) => {
      if (!onOrganizationsChange) return;

      const boundsString = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
      try {
        const response = await fetch(
          `/api/organizations?bounds=${boundsString}`
        );
        const newOrgs = await response.json();
        onOrganizationsChange(newOrgs);
      } catch (error) {
        console.error("Error fetching initial organizations:", error);
      }
    },
    [onOrganizationsChange]
  );

  // Update markers when organizations or categories change
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default;
      const map = mapRef.current;
      if (!map) return;

      // Clear existing markers and cluster group
      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }
      markersRef.current = [];

      const filteredOrgs = organizations.filter((org) =>
        selectedCategories.includes(org.category)
      );

      const bounds = L.latLngBounds([]);

      // Create new cluster group
      const clusterGroup = L.markerClusterGroup({
        iconCreateFunction: function (cluster: any) {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: renderToString(
              <div className="p-1 rounded-full shadow-xl">
                <div className="w-14 h-14 rounded-full bg-blue-500 border-4 border-white flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{count}</span>
                </div>
              </div>
            ),
            className: "custom-cluster",
            iconSize: [64, 64],
            iconAnchor: [32, 32],
          });
        },
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
      });

      filteredOrgs.forEach((org) => {
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
        }).bindPopup(`
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
        clusterGroup.addLayer(marker);
        bounds.extend([org.latitude, org.longitude]);
      });

      // Add cluster group to map
      clusterRef.current = clusterGroup;
      map.addLayer(clusterGroup);

      if (filteredOrgs.length > 0) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 13,
        });
      }
    };

    updateMarkers();
  }, [organizations, selectedCategories, isMapReady]);

  return (
    <div className="relative w-full h-screen">
      <div
        id="map"
        className="w-full h-full"
        style={{
          minHeight: "400px",
          position: "relative",
          zIndex: 1,
        }}
      />
      {isLoading && (
        <div
          className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg"
          role="status"
          aria-label="Loading locations"
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
