import { randomUUID } from "expo-crypto";
import { eq } from "drizzle-orm";

import type { TransactionStatus, TransactionType } from "../../domain/transaction";
import type { Database } from "../client";
import { transactions } from "../schema";

export type CreateTransactionInput = {
  type: TransactionType;
  status: TransactionStatus;
  amountCents: number;
  dueDate: string;
  description: string;
  categoryId: string;
  accountId: string;
  notes?: string | null;
  fixedExpenseId?: string | null;
  referenceMonth?: string | null;
};

export function createTransaction(db: Database, input: CreateTransactionInput): string {
  if (!Number.isInteger(input.amountCents) || input.amountCents < 0) {
    throw new Error("Transaction amount must be a non-negative integer in cents.");
  }

  const id = randomUUID();

  db.insert(transactions)
    .values({
      id,
      type: input.type,
      status: input.status,
      amountCents: input.amountCents,
      dueDate: input.dueDate,
      description: input.description,
      categoryId: input.categoryId,
      accountId: input.accountId,
      notes: input.notes ?? null,
      fixedExpenseId: input.fixedExpenseId ?? null,
      referenceMonth: input.referenceMonth ?? null,
    })
    .run();

  return id;
}

export function updateTransactionStatus(db: Database, id: string, status: TransactionStatus): void {
  db.update(transactions)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(transactions.id, id))
    .run();
}

export function deleteTransaction(db: Database, id: string): void {
  db.delete(transactions).where(eq(transactions.id, id)).run();
}
