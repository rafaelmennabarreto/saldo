import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

import { getMonthDateRange } from "../../utils/dateUtils";
import type { Database } from "../client";
import { accounts, categories, transactions } from "../schema";

export function selectTransactions(db: Database) {
  return db
    .select({
      id: transactions.id,
      type: transactions.type,
      status: transactions.status,
      amountCents: transactions.amountCents,
      dueDate: transactions.dueDate,
      description: transactions.description,
      notes: transactions.notes,
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
      accountId: transactions.accountId,
      accountName: accounts.name,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .orderBy(desc(transactions.dueDate), desc(transactions.createdAt));
}

export function selectRecentTransactions(db: Database, limit = 5) {
  return selectTransactions(db).limit(limit);
}

export function selectMonthlyTotals(db: Database, referenceMonth: string) {
  const { start, end } = getMonthDateRange(referenceMonth);

  return db
    .select({
      type: transactions.type,
      totalCents: sql<number>`coalesce(sum(${transactions.amountCents}), 0)`.mapWith(Number),
    })
    .from(transactions)
    .where(and(gte(transactions.dueDate, start), lte(transactions.dueDate, end)))
    .groupBy(transactions.type);
}

export type TransactionListRow = Awaited<ReturnType<typeof selectTransactions>>[number];
export type MonthlyTotalsRow = Awaited<ReturnType<typeof selectMonthlyTotals>>[number];
