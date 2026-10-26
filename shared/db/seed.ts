import { randomUUID } from "expo-crypto";

import type { FinanceColor } from "../domain/colors";
import type { FinanceIconName } from "../domain/icons";
import type { Database } from "./client";
import { accounts, categories } from "./schema";
import type { Account } from "./schema";

type SeedCategory = {
  name: string;
  icon: FinanceIconName;
  color: FinanceColor;
};

type SeedAccount = {
  name: string;
  icon: FinanceIconName;
  color: FinanceColor;
  type: Account["type"];
  includeInTotal: boolean;
  initialBalanceCents: number;
};

const defaultCategories: SeedCategory[] = [
  { name: "Alimentação & Mercado", icon: "shopping-cart", color: "coral300" },
  { name: "Moradia", icon: "house", color: "coral300" },
  { name: "Transporte", icon: "car", color: "coral300" },
  { name: "Saúde", icon: "heart-pulse", color: "coral300" },
  { name: "Lazer", icon: "coffee", color: "coral300" },
  { name: "Salário", icon: "banknote", color: "primary" },
  { name: "Freelance", icon: "briefcase", color: "primary" },
  { name: "Outros", icon: "tag", color: "neutral400" },
];

const defaultAccounts: SeedAccount[] = [
  {
    name: "Nubank Principal",
    icon: "landmark",
    color: "primary",
    type: "checking",
    includeInTotal: true,
    initialBalanceCents: 0,
  },
  {
    name: "Itaú Corrente",
    icon: "landmark",
    color: "primary",
    type: "checking",
    includeInTotal: true,
    initialBalanceCents: 0,
  },
  {
    name: "Carteira",
    icon: "wallet",
    color: "primary",
    type: "cash",
    includeInTotal: true,
    initialBalanceCents: 0,
  },
];

export function seedDefaultData(db: Database): void {
  db.transaction((tx) => {
    const hasCategories = tx.select({ id: categories.id }).from(categories).limit(1).get();
    const hasAccounts = tx.select({ id: accounts.id }).from(accounts).limit(1).get();

    if (!hasCategories) {
      tx.insert(categories).values(seedCategories()).run();
    }

    if (!hasAccounts) {
      tx.insert(accounts).values(seedAccounts()).run();
    }
  });
}

function seedCategories() {
  return defaultCategories.map((category) => ({
    id: randomUUID(),
    name: category.name,
    icon: category.icon,
    color: category.color,
  }));
}

function seedAccounts() {
  return defaultAccounts.map((account) => ({
    id: randomUUID(),
    name: account.name,
    icon: account.icon,
    color: account.color,
    type: account.type,
    includeInTotal: account.includeInTotal,
    initialBalanceCents: account.initialBalanceCents,
  }));
}
