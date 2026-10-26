import { asc, isNull } from "drizzle-orm";

import type { Database } from "../client";
import { accounts } from "../schema";

export function selectAccounts(db: Database) {
  return db.select().from(accounts).where(isNull(accounts.archivedAt)).orderBy(asc(accounts.name));
}
