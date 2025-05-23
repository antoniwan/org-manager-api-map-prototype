"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import OrgMap from "./components/OrgMap";
import CategoryFilter from "./components/CategoryFilter";
import { mockOrganizations, Category, categories } from "./data/mockOrgs";
import { LocationProvider } from "./contexts/LocationContext";
import LocationDetector from "./components/LocationDetector";

export default function Home() {
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(categories);
  const [organizations, setOrganizations] = useState<typeof mockOrganizations>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const loadingToast = toast.loading("Loading organizations...");
      try {
        const response = await fetch("/api/organizations");
        const data = await response.json();
        setOrganizations(data);
        toast.success("Organizations loaded successfully!", {
          id: loadingToast,
        });
      } catch (error) {
        toast.error("Failed to load organizations", { id: loadingToast });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleOrganizationsChange = (newOrgs: typeof mockOrganizations) => {
    setOrganizations(newOrgs);
  };

  const handleCategoriesChange = (newCategories: Category[]) => {
    setSelectedCategories(newCategories);
    if (newCategories.length === 0) {
      toast("No categories selected - showing all organizations");
    } else {
      toast(`Showing organizations in ${newCategories.length} categories`);
    }
  };

  if (isLoading) {
    return null; // Next.js will show the loading.tsx component
  }

  return (
    <LocationProvider>
      <LocationDetector />
      <main className="relative w-full h-screen">
        <OrgMap
          organizations={organizations}
          selectedCategories={selectedCategories}
          onOrganizationsChange={handleOrganizationsChange}
        />
        <CategoryFilter onCategoriesChange={handleCategoriesChange} />
      </main>
    </LocationProvider>
  );
}
