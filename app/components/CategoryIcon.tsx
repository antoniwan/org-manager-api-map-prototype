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
} from "react-icons/fa";
import { Category } from "../data/mockOrgs";

interface CategoryIconProps {
  category: Category;
  className?: string;
}

const categoryIcons: Record<Category, IconType> = {
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
};

export default function CategoryIcon({
  category,
  className = "",
}: CategoryIconProps) {
  const Icon = categoryIcons[category];
  return <Icon className={className} />;
}
