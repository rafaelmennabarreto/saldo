import {
  Banknote,
  Briefcase,
  Car,
  Coffee,
  CreditCard,
  Dumbbell,
  HeartPulse,
  House,
  Landmark,
  Receipt,
  ShoppingCart,
  Tag,
  Wallet,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react-native";

export const financeIcons = {
  banknote: Banknote,
  briefcase: Briefcase,
  car: Car,
  coffee: Coffee,
  "credit-card": CreditCard,
  dumbbell: Dumbbell,
  "heart-pulse": HeartPulse,
  house: House,
  landmark: Landmark,
  receipt: Receipt,
  "shopping-cart": ShoppingCart,
  tag: Tag,
  wallet: Wallet,
  wifi: Wifi,
  zap: Zap,
} as const;

export type FinanceIconName = keyof typeof financeIcons;

export function isFinanceIcon(name: string): name is FinanceIconName {
  return name in financeIcons;
}

export function getFinanceIcon(name: string): LucideIcon {
  return isFinanceIcon(name) ? financeIcons[name] : Receipt;
}
