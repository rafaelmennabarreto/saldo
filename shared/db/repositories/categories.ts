import { randomUUID } from "expo-crypto";
import { eq } from "drizzle-orm";

import type { FinanceColor } from "../../domain/colors";
import type { FinanceIconName } from "../../domain/icons";
import type { Database } from "../client";
import { categories } from "../schema";

export type CreateCategoryInput = {
  name: string;
  icon: FinanceIconName;
  color: FinanceColor;
};

export function createCategory(db: Database, input: CreateCategoryInput): string {
  const id = randomUUID();

  db.insert(categories)
    .values({
      id,
      name: input.name,
      icon: input.icon,
      color: input.color,
    })
    .run();

  return id;
}

export function archiveCategory(db: Database, id: string): void {
  const now = new Date().toISOString();

  db.update(categories).set({ archivedAt: now, updatedAt: now }).where(eq(categories.id, id)).run();
}
