import type { LucideIcon } from "lucide-react-native";

import { getFinanceIcon } from "./icons";

export type TransactionType = "income" | "expense";
export type TransactionStatus = "open" | "paid";

export type TransactionListItemData = {
  id: string;
  title: string;
  date: string;
  time?: string;
  account: string;
  amountCents: number;
  type: TransactionType;
  status: TransactionStatus;
  icon: LucideIcon;
};

export type TransactionDisplaySource = {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amountCents: number;
  dueDate: string;
  description: string;
  accountName: string;
  categoryIcon: string;
};

export function toTransactionListItem(row: TransactionDisplaySource): TransactionListItemData {
  return {
    id: row.id,
    title: row.description,
    date: row.dueDate,
    account: row.accountName,
    amountCents: row.amountCents,
    type: row.type,
    status: row.status,
    icon: getFinanceIcon(row.categoryIcon),
  };
}
