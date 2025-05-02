import { IconType } from "react-icons";
import {
  FaStore,
  FaShoppingBag,
  FaStoreAlt,
  FaBuilding,
  FaShoppingCart,
  FaTshirt,
  FaGem,
  FaShoppingBasket,
  FaCartPlus,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
} from "react-icons/fa";
import { Category } from "../data/mockOrgs";

interface CategoryIconProps {
  category: Category | "Location" | "Phone" | "Clock";
  className?: string;
}

const categoryIcons: Record<
  Category | "Location" | "Phone" | "Clock",
  IconType
> = {
  "Retail Store": FaStore,
  "Outlet Store": FaShoppingBag,
  "Pop-up Shop": FaStoreAlt,
  "Flagship Store": FaBuilding,
  "Department Store": FaShoppingCart,
  "Specialty Store": FaTshirt,
  Boutique: FaGem,
  "Convenience Store": FaShoppingBasket,
  Supermarket: FaCartPlus,
  "Shopping Mall": FaStoreAlt,
  Location: FaMapMarkerAlt,
  Phone: FaPhone,
  Clock: FaClock,
};

export default function CategoryIcon({
  category,
  className = "",
}: CategoryIconProps) {
  const Icon = categoryIcons[category];
  return <Icon className={className} />;
}
