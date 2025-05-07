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
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const clusterRef = useRef<InstanceType<typeof import("leaflet").MarkerClusterGroup> | null>(null);
  const { location } = useLocation();
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const lastBoundsRef = useRef<string | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMovingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || hasInitializedRef.current) return;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet and its plugins only on client side
        const leaflet = await import("leaflet");
        const markerCluster = await import("leaflet.markercluster");

        const L = { ...leaflet, ...markerCluster };

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
          addUserMarker(map, location, L);
        }

        // Setup map event listeners
        setupMapEventListeners(map, L);

        // Initial data fetch
        fetchOrganizationsForBounds(map.getBounds(), L);
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
    (map: L.Map, userLocation: { latitude: number; longitude: number }, L: typeof import("leaflet")) => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

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
    (map: L.Map, L: typeof import("leaflet")) => {
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
    async (bounds: L.LatLngBounds, L: typeof import("leaflet")) => {
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
      const leaflet = await import("leaflet");
      const markerCluster = await import("leaflet.markercluster");
      const L = { ...leaflet, ...markerCluster };

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
        iconCreateFunction: function (cluster) {
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
        }).bindPopup(
          `
          <div class="min-w-[280px] bg-white p-3">
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-[14px] font-medium">${org.name}</h3>
              <span class="text-[13px] text-gray-600">${org.category}</span>
            </div>
            
            <p class="text-[13px] text-gray-600 mb-3">${org.description}</p>
            
            <div class="space-y-1">
              <div class="text-[13px]">${org.address}</div>
              <div class="text-[13px] text-gray-600">${org.phone}</div>
              <div class="text-[13px] text-gray-600">${org.hours}</div>
            </div>

            <div class="mt-3 pt-2 border-t border-gray-200">
              <div class="text-[12px] text-gray-600 mb-1">AVAILABLE SERVICES</div>
              <div class="flex flex-wrap gap-1">
                ${org.services
                  .map(
                    (service) =>
                      `<span class="text-[13px]">${service}</span>${
                        service !== org.services[org.services.length - 1]
                          ? '<span class="text-gray-400 mx-0.5">•</span>'
                          : ""
                      }`
                  )
                  .join("")}
              </div>
            </div>
          </div>
        `,
          {
            className: "custom-popup",
          }
        );

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
