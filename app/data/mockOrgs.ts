export type Category = "Education" | "Health" | "Finance" | "Community";

export interface Organization {
  id: string;
  name: string;
  category: Category;
  latitude: number;
  longitude: number;
  description: string;
}

export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "City University",
    category: "Education",
    latitude: 40.7128,
    longitude: -74.006,
    description: "Leading educational institution in the city",
  },
  {
    id: "2",
    name: "Community Health Center",
    category: "Health",
    latitude: 40.7145,
    longitude: -74.008,
    description: "Providing healthcare services to the community",
  },
  {
    id: "3",
    name: "Local Credit Union",
    category: "Finance",
    latitude: 40.7135,
    longitude: -74.007,
    description: "Community-focused financial services",
  },
  {
    id: "4",
    name: "Neighborhood Association",
    category: "Community",
    latitude: 40.715,
    longitude: -74.009,
    description: "Local community organization",
  },
];

export const categories: Category[] = [
  "Education",
  "Health",
  "Finance",
  "Community",
];
