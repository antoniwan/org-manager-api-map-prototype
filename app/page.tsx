"use client";

import { useState } from "react";
import OrgMap from "./components/OrgMap";
import CategoryFilter from "./components/CategoryFilter";
import { mockOrganizations, Category } from "./data/mockOrgs";

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([
    "Education",
    "Health",
    "Finance",
    "Community",
  ]);

  return (
    <main className="relative w-full h-screen">
      <OrgMap
        organizations={mockOrganizations}
        selectedCategories={selectedCategories}
      />
      <CategoryFilter onCategoriesChange={setSelectedCategories} />
    </main>
  );
}
