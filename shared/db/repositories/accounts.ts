import { randomUUID } from "expo-crypto";
import { eq } from "drizzle-orm";

import type { FinanceColor } from "../../domain/colors";
import type { FinanceIconName } from "../../domain/icons";
import type { Database } from "../client";
import { accounts } from "../schema";
import type { Account } from "../schema";

export type CreateAccountInput = {
  name: string;
  icon: FinanceIconName;
  color: FinanceColor;
  type: Account["type"];
  includeInTotal: boolean;
  initialBalanceCents: number;
};

export function createAccount(db: Database, input: CreateAccountInput): string {
  const id = randomUUID();

  db.insert(accounts)
    .values({
      id,
      name: input.name,
      icon: input.icon,
      color: input.color,
      type: input.type,
      includeInTotal: input.includeInTotal,
      initialBalanceCents: input.initialBalanceCents,
    })
    .run();

  return id;
}

export function archiveAccount(db: Database, id: string): void {
  const now = new Date().toISOString();

  db.update(accounts).set({ archivedAt: now, updatedAt: now }).where(eq(accounts.id, id)).run();
}
