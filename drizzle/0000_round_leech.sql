CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`type` text NOT NULL,
	`include_in_total` integer DEFAULT true NOT NULL,
	`initial_balance_cents` integer DEFAULT 0 NOT NULL,
	`archived_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	CONSTRAINT "accounts_type_check" CHECK("accounts"."type" in ('checking', 'savings', 'cash', 'investment'))
);
--> statement-breakpoint
CREATE INDEX `accounts_archived_at_idx` ON `accounts` (`archived_at`);--> statement-breakpoint
CREATE TABLE `budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`reference_month` text NOT NULL,
	`planned_cents` integer NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "budgets_planned_cents_check" CHECK("budgets"."planned_cents" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `budgets_category_month_unique_idx` ON `budgets` (`category_id`,`reference_month`);--> statement-breakpoint
CREATE TABLE `card_installments` (
	`id` text PRIMARY KEY NOT NULL,
	`purchase_id` text NOT NULL,
	`reference_month` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`purchase_id`) REFERENCES `card_purchases`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "card_installments_amount_cents_check" CHECK("card_installments"."amount_cents" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `card_installments_purchase_month_unique_idx` ON `card_installments` (`purchase_id`,`reference_month`);--> statement-breakpoint
CREATE INDEX `card_installments_reference_month_idx` ON `card_installments` (`reference_month`);--> statement-breakpoint
CREATE TABLE `card_purchases` (
	`id` text PRIMARY KEY NOT NULL,
	`card_id` text NOT NULL,
	`purchase_date` text NOT NULL,
	`description` text NOT NULL,
	`category_id` text,
	`total_cents` integer NOT NULL,
	`installments_count` integer DEFAULT 1 NOT NULL,
	`is_fixed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`card_id`) REFERENCES `cards`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "card_purchases_total_cents_check" CHECK("card_purchases"."total_cents" >= 0),
	CONSTRAINT "card_purchases_installments_count_check" CHECK("card_purchases"."installments_count" >= 1)
);
--> statement-breakpoint
CREATE INDEX `card_purchases_card_id_idx` ON `card_purchases` (`card_id`);--> statement-breakpoint
CREATE INDEX `card_purchases_purchase_date_idx` ON `card_purchases` (`purchase_date`);--> statement-breakpoint
CREATE INDEX `card_purchases_category_id_idx` ON `card_purchases` (`category_id`);--> statement-breakpoint
CREATE TABLE `cards` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`brand` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`closing_day` integer NOT NULL,
	`due_day` integer NOT NULL,
	`limit_cents` integer DEFAULT 0 NOT NULL,
	`is_primary` integer DEFAULT false NOT NULL,
	`archived_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	CONSTRAINT "cards_closing_day_check" CHECK("cards"."closing_day" between 1 and 31),
	CONSTRAINT "cards_due_day_check" CHECK("cards"."due_day" between 1 and 31),
	CONSTRAINT "cards_limit_cents_check" CHECK("cards"."limit_cents" >= 0)
);
--> statement-breakpoint
CREATE INDEX `cards_archived_at_idx` ON `cards` (`archived_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `cards_primary_unique_idx` ON `cards` (`is_primary`) WHERE "cards"."is_primary" = 1 and "cards"."archived_at" is null;--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL,
	`color` text NOT NULL,
	`archived_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `categories_archived_at_idx` ON `categories` (`archived_at`);--> statement-breakpoint
CREATE TABLE `fixed_expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`amount_cents` integer NOT NULL,
	`type` text NOT NULL,
	`due_day` integer NOT NULL,
	`description` text NOT NULL,
	`category_id` text NOT NULL,
	`account_id` text NOT NULL,
	`notes` text,
	`is_active` integer DEFAULT true NOT NULL,
	`archived_at` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "fixed_expenses_amount_cents_check" CHECK("fixed_expenses"."amount_cents" >= 0),
	CONSTRAINT "fixed_expenses_type_check" CHECK("fixed_expenses"."type" in ('income', 'expense')),
	CONSTRAINT "fixed_expenses_due_day_check" CHECK("fixed_expenses"."due_day" between 1 and 31)
);
--> statement-breakpoint
CREATE INDEX `fixed_expenses_category_id_idx` ON `fixed_expenses` (`category_id`);--> statement-breakpoint
CREATE INDEX `fixed_expenses_account_id_idx` ON `fixed_expenses` (`account_id`);--> statement-breakpoint
CREATE INDEX `fixed_expenses_archived_at_idx` ON `fixed_expenses` (`archived_at`);--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'open' NOT NULL,
	`amount_cents` integer NOT NULL,
	`due_date` text NOT NULL,
	`description` text NOT NULL,
	`category_id` text NOT NULL,
	`account_id` text NOT NULL,
	`notes` text,
	`fixed_expense_id` text,
	`reference_month` text,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`fixed_expense_id`) REFERENCES `fixed_expenses`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "transactions_type_check" CHECK("transactions"."type" in ('income', 'expense')),
	CONSTRAINT "transactions_status_check" CHECK("transactions"."status" in ('open', 'paid')),
	CONSTRAINT "transactions_amount_cents_check" CHECK("transactions"."amount_cents" >= 0)
);
--> statement-breakpoint
CREATE INDEX `transactions_due_date_idx` ON `transactions` (`due_date`);--> statement-breakpoint
CREATE INDEX `transactions_category_id_idx` ON `transactions` (`category_id`);--> statement-breakpoint
CREATE INDEX `transactions_account_id_idx` ON `transactions` (`account_id`);--> statement-breakpoint
CREATE INDEX `transactions_reference_month_idx` ON `transactions` (`reference_month`);--> statement-breakpoint
CREATE UNIQUE INDEX `transactions_fixed_expense_month_unique_idx` ON `transactions` (`fixed_expense_id`,`reference_month`) WHERE "transactions"."fixed_expense_id" is not null and "transactions"."reference_month" is not null;