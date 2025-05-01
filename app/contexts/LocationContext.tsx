"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

interface LocationContextType {
  location: Location | null;
  setLocation: (location: Location | null) => void;
}

const LocationContext = createContext<LocationContextType>({
  location: null,
  setLocation: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
