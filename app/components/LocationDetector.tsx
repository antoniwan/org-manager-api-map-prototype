"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useLocation } from "../contexts/LocationContext";

export default function LocationDetector() {
  const { setLocation } = useLocation();

  useEffect(() => {
    const detectLocation = async () => {
      // First try to get location from browser
      if ("geolocation" in navigator) {
        const locationToast = toast.loading(
          "Requesting location permission...",
          { id: "location-loading" }
        );

        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              });
            }
          );

          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          toast.success("Location detected successfully!", {
            id: "location-success",
            duration: Infinity,
          });
        } catch (error) {
          toast.error(
            "Location permission denied. Trying IP-based detection...",
            { id: "location-error" }
          );

          // Fallback to IP-based location
          const ipLocationToast = toast.loading(
            "Detecting location via IP...",
            { id: "location-ip-loading" }
          );
          try {
            const response = await fetch("https://ipapi.co/json/");
            const data = await response.json();

            setLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              city: data.city,
              country: data.country_name,
            });

            toast.success(
              `Location detected via IP: ${data.city}, ${data.country_name}`,
              {
                id: "location-ip-success",
                duration: Infinity,
              }
            );
          } catch (ipError) {
            toast.error("Failed to detect location via IP", {
              id: "location-ip-error",
            });
          }
        }
      } else {
        // Browser doesn't support geolocation, try IP-based detection
        const ipLocationToast = toast.loading("Detecting location via IP...", {
          id: "location-ip-loading",
        });
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();

          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city,
            country: data.country_name,
          });

          toast.success(
            `Location detected via IP: ${data.city}, ${data.country_name}`,
            {
              id: "location-ip-success",
              duration: Infinity,
            }
          );
        } catch (error) {
          toast.error("Failed to detect location", { id: "location-ip-error" });
        }
      }
    };

    detectLocation();
  }, [setLocation]);

  return null; // This component doesn't render anything
}
