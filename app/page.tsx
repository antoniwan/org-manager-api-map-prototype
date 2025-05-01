"use client";

import { useState } from "react";
import OrgMap from "./components/OrgMap";
import CategoryFilter from "./components/CategoryFilter";
import { mockOrganizations, Category, categories } from "./data/mockOrgs";

export default function Home() {
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(categories);

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
