"use client";

import { Category, categories } from "../data/mockOrgs";
import { useState } from "react";

interface CategoryFilterProps {
  onCategoriesChange: (categories: Category[]) => void;
}

export default function CategoryFilter({
  onCategoriesChange,
}: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] =
    useState<Category[]>(categories);

  const handleCategoryToggle = (category: Category) => {
    const newSelectedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    onCategoriesChange(newSelectedCategories);
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
