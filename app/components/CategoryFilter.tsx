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
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-50 border border-gray-200">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Categories</h2>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <span className="text-gray-700">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
