import { asc, isNull } from "drizzle-orm";

import type { Database } from "../client";
import { categories } from "../schema";

export function selectCategories(db: Database) {
  return db
    .select()
    .from(categories)
    .where(isNull(categories.archivedAt))
    .orderBy(asc(categories.name));
}
