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

export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Oviedo Mall",
    category: "Shopping Mall",
    latitude: 28.6573,
    longitude: -81.2301,
    description:
      "Major shopping destination featuring retail stores, dining options, and entertainment.",
    address: "1700 Oviedo Mall Blvd, Oviedo, FL 32765",
    phone: "(407) 977-2400",
    hours: "10:00 AM - 9:00 PM",
    services: ["Shopping", "Dining", "Entertainment", "Parking"],
    brandIds: [],
  },
  {
    id: "2",
    name: "Winter Park Village",
    category: "Shopping Mall",
    latitude: 28.6006,
    longitude: -81.3647,
    description: "Open-air lifestyle center with upscale shopping and dining",
    address: "510 N Orlando Ave, Winter Park, FL 32789",
    phone: "(407) 571-2700",
    hours: "10:00 AM - 9:00 PM",
    services: ["Shopping", "Dining", "Entertainment", "Valet Parking"],
    brandIds: [],
  },
  {
    id: "3",
    name: "The Mall at Millenia",
    category: "Shopping Mall",
    latitude: 28.4851,
    longitude: -81.4343,
    description:
      "Luxury shopping destination featuring high-end retailers and dining",
    address: "4200 Conroy Rd, Orlando, FL 32839",
    phone: "(407) 363-3555",
    hours: "10:00 AM - 9:00 PM",
    services: ["Luxury Shopping", "Fine Dining", "Valet Parking", "Concierge"],
    brandIds: [],
  },
  {
    id: "4",
    name: "Orlando International Premium Outlets",
    category: "Outlet Store",
    latitude: 28.4697,
    longitude: -81.4505,
    description: "Large outlet mall featuring discounted designer brands",
    address: "4951 International Dr, Orlando, FL 32819",
    phone: "(407) 352-9600",
    hours: "10:00 AM - 9:00 PM",
    services: ["Outlet Shopping", "Food Court", "Tourist Information"],
    brandIds: [],
  },
  {
    id: "5",
    name: "Waterford Lakes Town Center",
    category: "Shopping Mall",
    latitude: 28.5489,
    longitude: -81.2067,
    description:
      "Open-air shopping center with diverse retail and dining options",
    address: "413 N Alafaya Trail, Orlando, FL 32828",
    phone: "(407) 737-2866",
    hours: "10:00 AM - 9:00 PM",
    services: ["Shopping", "Dining", "Entertainment", "Parking"],
    brandIds: [],
  },
  {
    id: "6",
    name: "Winter Springs Town Center",
    category: "Retail Store",
    latitude: 28.6989,
    longitude: -81.3062,
    description: "Local shopping center with everyday retail needs",
    address: "1160 E State Road 434, Winter Springs, FL 32708",
    phone: "(407) 696-8900",
    hours: "9:00 AM - 9:00 PM",
    services: ["Shopping", "Dining", "Services"],
    brandIds: [],
  },
  {
    id: "7",
    name: "Oviedo City Center",
    category: "Pop-up Shop",
    latitude: 28.6695,
    longitude: -81.2087,
    description: "Mixed-use development featuring boutiques and local shops",
    address: "1000 Oviedo Blvd, Oviedo, FL 32765",
    phone: "(407) 365-6500",
    hours: "11:00 AM - 8:00 PM",
    services: ["Local Shopping", "Dining", "Events"],
    brandIds: [],
  },
];

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
