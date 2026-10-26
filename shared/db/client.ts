import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

import * as schema from "./schema";

export const DATABASE_NAME = "financas.db";

export const expoDatabase = SQLite.openDatabaseSync(DATABASE_NAME, {
  enableChangeListener: true,
});

expoDatabase.execSync("PRAGMA journal_mode = WAL;");
expoDatabase.execSync("PRAGMA foreign_keys = ON;");

export const db = drizzle(expoDatabase, { schema });

export type Database = typeof db;
