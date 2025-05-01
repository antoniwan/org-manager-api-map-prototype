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
}

export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Tool Depot - Manhattan",
    category: "Retail Store",
    latitude: 40.7128,
    longitude: -74.006,
    description:
      "Full-service tool retailer with extensive inventory of power tools, hand tools, and accessories",
    address: "123 Broadway, New York, NY 10001",
    phone: "(212) 555-1001",
    hours: "Mon-Fri: 8AM-8PM, Sat: 9AM-6PM, Sun: 10AM-5PM",
    services: ["Tool Sales", "Equipment Rental", "Expert Advice"],
  },
  {
    id: "2",
    name: "Power Tool Pro Shop",
    category: "Specialty Store",
    latitude: 40.7145,
    longitude: -74.008,
    description: "Specialized power tool retailer with expert staff",
    address: "456 Canal St, New York, NY 10013",
    phone: "(212) 555-2002",
    hours: "Mon-Fri: 9AM-5PM",
    services: ["Tool Sales", "Expert Consultation", "Custom Orders"],
  },
  {
    id: "3",
    name: "Tools & More Department Store",
    category: "Department Store",
    latitude: 40.7135,
    longitude: -74.007,
    description: "Large department store with extensive tool section",
    address: "789 Park Ave, New York, NY 10022",
    phone: "(212) 555-3003",
    hours: "Mon-Fri: 9AM-5PM",
    services: ["Tool Sales", "Home Goods", "Garden Equipment"],
  },
  {
    id: "4",
    name: "Premium Tools Outlet",
    category: "Outlet Store",
    latitude: 40.715,
    longitude: -74.009,
    description: "Discounted premium tools and equipment",
    address: "321 Hudson St, New York, NY 10014",
    phone: "(212) 555-4004",
    hours: "Mon-Fri: 8AM-6PM",
    services: ["Discounted Tools", "Clearance Items", "Bulk Sales"],
  },
  {
    id: "5",
    name: "Tool Boutique",
    category: "Boutique",
    latitude: 40.716,
    longitude: -74.01,
    description: "High-end specialty tools and equipment",
    address: "654 West St, New York, NY 10014",
    phone: "(212) 555-5005",
    hours: "Mon-Fri: 7AM-4PM",
    services: ["Premium Tools", "Custom Orders", "Expert Consultation"],
  },
  {
    id: "6",
    name: "Quick Tools Express",
    category: "Convenience Store",
    latitude: 40.717,
    longitude: -74.011,
    description: "Quick access to essential tools and supplies",
    address: "987 Greenwich St, New York, NY 10014",
    phone: "(212) 555-6006",
    hours: "Mon-Sat: 9AM-5PM",
    services: ["Basic Tools", "Emergency Supplies", "Quick Service"],
  },
  {
    id: "7",
    name: "Tools Pop-up NYC",
    category: "Pop-up Shop",
    latitude: 40.718,
    longitude: -74.012,
    description: "Temporary pop-up shop featuring seasonal tools and equipment",
    address: "Mobile Location - Check Website",
    phone: "(212) 555-7007",
    hours: "Varies by Location",
    services: ["Seasonal Tools", "Limited Edition Items", "Special Deals"],
  },
  {
    id: "8",
    name: "ToolMart Supermarket",
    category: "Supermarket",
    latitude: 40.719,
    longitude: -74.013,
    description: "Large format store with comprehensive tool selection",
    address: "147 Spring St, New York, NY 10012",
    phone: "(212) 555-8008",
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    services: ["Wide Selection", "Bulk Purchase", "Price Matching"],
  },
  {
    id: "9",
    name: "Tools Flagship NYC",
    category: "Flagship Store",
    latitude: 40.72,
    longitude: -74.014,
    description: "Premium flagship store with complete brand experience",
    address: "258 Varick St, New York, NY 10014",
    phone: "(212) 555-9009",
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
    services: ["Premium Experience", "Full Product Line", "Expert Staff"],
  },
  {
    id: "10",
    name: "Tool Mall Complex",
    category: "Shopping Mall",
    latitude: 40.721,
    longitude: -74.015,
    description: "Multi-vendor tool shopping complex",
    address: "369 Bleecker St, New York, NY 10014",
    phone: "(212) 555-1010",
    hours: "Mon-Sat: 9AM-7PM, Sun: 11AM-5PM",
    services: ["Multiple Vendors", "Food Court", "Tool Demonstrations"],
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
