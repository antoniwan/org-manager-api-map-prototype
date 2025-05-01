export type Category =
  | "Retail Store"
  | "Service Center"
  | "Repair Center"
  | "Warranty Center"
  | "Headquarters"
  | "Distribution Center"
  | "Training Center"
  | "Authorized Dealer"
  | "Mobile Service"
  | "Parts Center";

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
    name: "Power Tool Pro Service Center",
    category: "Service Center",
    latitude: 40.7145,
    longitude: -74.008,
    description: "Authorized service center for major power tool brands",
    address: "456 Canal St, New York, NY 10013",
    phone: "(212) 555-2002",
    hours: "Mon-Fri: 9AM-5PM",
    services: ["Tool Repair", "Maintenance", "Parts Replacement"],
  },
  {
    id: "3",
    name: "Global Tools HQ",
    category: "Headquarters",
    latitude: 40.7135,
    longitude: -74.007,
    description: "Corporate headquarters of Global Tools Inc.",
    address: "789 Park Ave, New York, NY 10022",
    phone: "(212) 555-3003",
    hours: "Mon-Fri: 9AM-5PM",
    services: ["Corporate Office", "Customer Support", "Product Development"],
  },
  {
    id: "4",
    name: "ToolTech Warranty Center",
    category: "Warranty Center",
    latitude: 40.715,
    longitude: -74.009,
    description: "Official warranty service center for ToolTech products",
    address: "321 Hudson St, New York, NY 10014",
    phone: "(212) 555-4004",
    hours: "Mon-Fri: 8AM-6PM",
    services: ["Warranty Claims", "Product Registration", "Extended Warranty"],
  },
  {
    id: "5",
    name: "ToolMaster Distribution",
    category: "Distribution Center",
    latitude: 40.716,
    longitude: -74.01,
    description: "Regional distribution center for professional tools",
    address: "654 West St, New York, NY 10014",
    phone: "(212) 555-5005",
    hours: "Mon-Fri: 7AM-4PM",
    services: ["Bulk Orders", "Wholesale Distribution", "Inventory Management"],
  },
  {
    id: "6",
    name: "ProTool Training Academy",
    category: "Training Center",
    latitude: 40.717,
    longitude: -74.011,
    description: "Professional training center for tool operation and safety",
    address: "987 Greenwich St, New York, NY 10014",
    phone: "(212) 555-6006",
    hours: "Mon-Sat: 9AM-5PM",
    services: ["Safety Training", "Tool Certification", "Workshops"],
  },
  {
    id: "7",
    name: "Mobile Tool Repair NYC",
    category: "Mobile Service",
    latitude: 40.718,
    longitude: -74.012,
    description: "On-site tool repair and maintenance service",
    address: "Mobile Service - Serving NYC Area",
    phone: "(212) 555-7007",
    hours: "24/7 Emergency Service",
    services: ["On-site Repair", "Emergency Service", "Preventive Maintenance"],
  },
  {
    id: "8",
    name: "ToolParts Direct",
    category: "Parts Center",
    latitude: 40.719,
    longitude: -74.013,
    description: "Specialized parts and accessories center",
    address: "147 Spring St, New York, NY 10012",
    phone: "(212) 555-8008",
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    services: ["Parts Sales", "Replacement Parts", "Accessories"],
  },
  {
    id: "9",
    name: "ToolPro Repair Center",
    category: "Repair Center",
    latitude: 40.72,
    longitude: -74.014,
    description: "Specialized repair center for industrial tools",
    address: "258 Varick St, New York, NY 10014",
    phone: "(212) 555-9009",
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-2PM",
    services: ["Industrial Tool Repair", "Calibration", "Performance Testing"],
  },
  {
    id: "10",
    name: "Elite Tools Dealer",
    category: "Authorized Dealer",
    latitude: 40.721,
    longitude: -74.015,
    description: "Authorized dealer for premium tool brands",
    address: "369 Bleecker St, New York, NY 10014",
    phone: "(212) 555-1010",
    hours: "Mon-Sat: 9AM-7PM, Sun: 11AM-5PM",
    services: ["Premium Tools", "Expert Consultation", "Special Orders"],
  },
];

export const categories: Category[] = [
  "Retail Store",
  "Service Center",
  "Repair Center",
  "Warranty Center",
  "Headquarters",
  "Distribution Center",
  "Training Center",
  "Authorized Dealer",
  "Mobile Service",
  "Parts Center",
];
