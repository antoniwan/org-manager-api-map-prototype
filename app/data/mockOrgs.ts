import { Brand } from "./mockBrands";

export type Category =
  | "Retail Store"
  | "Outlet Store"
  | "Pop-up Shop"
  | "Flagship Store"
  | "Department Store"
  | "Specialty Store"
  | "Boutique"
  | "Convenience Store"
  | "Supermarket"
  | "Shopping Mall";

export interface Organization {
  id: string;
  name: string;
  category: Category;
  latitude: number;
  longitude: number;
  description: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  brandIds: string[];
}

export const mockOrganizations: Organization[] = [];

export const categories: Category[] = [
  "Retail Store",
  "Outlet Store",
  "Pop-up Shop",
  "Flagship Store",
  "Department Store",
  "Specialty Store",
  "Boutique",
  "Convenience Store",
  "Supermarket",
  "Shopping Mall",
];
