import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
};

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    archivedAt: text("archived_at"),
    ...timestamps,
  },
  (table) => [index("categories_archived_at_idx").on(table.archivedAt)],
);

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    type: text("type", { enum: ["checking", "savings", "cash", "investment"] }).notNull(),
    includeInTotal: integer("include_in_total", { mode: "boolean" }).notNull().default(true),
    initialBalanceCents: integer("initial_balance_cents").notNull().default(0),
    archivedAt: text("archived_at"),
    ...timestamps,
  },
  (table) => [
    index("accounts_archived_at_idx").on(table.archivedAt),
    check(
      "accounts_type_check",
      sql`${table.type} in ('checking', 'savings', 'cash', 'investment')`,
    ),
  ],
);

export const cards = sqliteTable(
  "cards",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    brand: text("brand").notNull(),
    icon: text("icon").notNull(),
    color: text("color").notNull(),
    closingDay: integer("closing_day").notNull(),
    dueDay: integer("due_day").notNull(),
    limitCents: integer("limit_cents").notNull().default(0),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
    archivedAt: text("archived_at"),
    ...timestamps,
  },
  (table) => [
    index("cards_archived_at_idx").on(table.archivedAt),
    uniqueIndex("cards_primary_unique_idx")
      .on(table.isPrimary)
      .where(sql`${table.isPrimary} = 1 and ${table.archivedAt} is null`),
    check("cards_closing_day_check", sql`${table.closingDay} between 1 and 31`),
    check("cards_due_day_check", sql`${table.dueDay} between 1 and 31`),
    check("cards_limit_cents_check", sql`${table.limitCents} >= 0`),
  ],
);

export const fixedExpenses = sqliteTable(
  "fixed_expenses",
  {
    id: text("id").primaryKey(),
    amountCents: integer("amount_cents").notNull(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    dueDay: integer("due_day").notNull(),
    description: text("description").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    notes: text("notes"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    archivedAt: text("archived_at"),
    ...timestamps,
  },
  (table) => [
    index("fixed_expenses_category_id_idx").on(table.categoryId),
    index("fixed_expenses_account_id_idx").on(table.accountId),
    index("fixed_expenses_archived_at_idx").on(table.archivedAt),
    check("fixed_expenses_amount_cents_check", sql`${table.amountCents} >= 0`),
    check("fixed_expenses_type_check", sql`${table.type} in ('income', 'expense')`),
    check("fixed_expenses_due_day_check", sql`${table.dueDay} between 1 and 31`),
  ],
);

export const transactions = sqliteTable(
  "transactions",
  {
    id: text("id").primaryKey(),
    type: text("type", { enum: ["income", "expense"] }).notNull(),
    status: text("status", { enum: ["open", "paid"] })
      .notNull()
      .default("open"),
    amountCents: integer("amount_cents").notNull(),
    dueDate: text("due_date").notNull(),
    description: text("description").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "restrict" }),
    notes: text("notes"),
    fixedExpenseId: text("fixed_expense_id").references(() => fixedExpenses.id, {
      onDelete: "set null",
    }),
    referenceMonth: text("reference_month"),
    ...timestamps,
  },
  (table) => [
    index("transactions_due_date_idx").on(table.dueDate),
    index("transactions_category_id_idx").on(table.categoryId),
    index("transactions_account_id_idx").on(table.accountId),
    index("transactions_reference_month_idx").on(table.referenceMonth),
    uniqueIndex("transactions_fixed_expense_month_unique_idx")
      .on(table.fixedExpenseId, table.referenceMonth)
      .where(sql`${table.fixedExpenseId} is not null and ${table.referenceMonth} is not null`),
    check("transactions_type_check", sql`${table.type} in ('income', 'expense')`),
    check("transactions_status_check", sql`${table.status} in ('open', 'paid')`),
    check("transactions_amount_cents_check", sql`${table.amountCents} >= 0`),
  ],
);

export const budgets = sqliteTable(
  "budgets",
  {
    id: text("id").primaryKey(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    referenceMonth: text("reference_month").notNull(),
    plannedCents: integer("planned_cents").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("budgets_category_month_unique_idx").on(table.categoryId, table.referenceMonth),
    check("budgets_planned_cents_check", sql`${table.plannedCents} >= 0`),
  ],
);

export const cardPurchases = sqliteTable(
  "card_purchases",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "restrict" }),
    purchaseDate: text("purchase_date").notNull(),
    description: text("description").notNull(),
    categoryId: text("category_id").references(() => categories.id, { onDelete: "restrict" }),
    totalCents: integer("total_cents").notNull(),
    installmentsCount: integer("installments_count").notNull().default(1),
    isFixed: integer("is_fixed", { mode: "boolean" }).notNull().default(false),
    ...timestamps,
  },
  (table) => [
    index("card_purchases_card_id_idx").on(table.cardId),
    index("card_purchases_purchase_date_idx").on(table.purchaseDate),
    index("card_purchases_category_id_idx").on(table.categoryId),
    check("card_purchases_total_cents_check", sql`${table.totalCents} >= 0`),
    check("card_purchases_installments_count_check", sql`${table.installmentsCount} >= 1`),
  ],
);

export const cardInstallments = sqliteTable(
  "card_installments",
  {
    id: text("id").primaryKey(),
    purchaseId: text("purchase_id")
      .notNull()
      .references(() => cardPurchases.id, { onDelete: "cascade" }),
    referenceMonth: text("reference_month").notNull(),
    amountCents: integer("amount_cents").notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("card_installments_purchase_month_unique_idx").on(
      table.purchaseId,
      table.referenceMonth,
    ),
    index("card_installments_reference_month_idx").on(table.referenceMonth),
    check("card_installments_amount_cents_check", sql`${table.amountCents} >= 0`),
  ],
);

export type Category = typeof categories.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type FixedExpense = typeof fixedExpenses.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type CardPurchase = typeof cardPurchases.$inferSelect;
export type CardInstallment = typeof cardInstallments.$inferSelect;
