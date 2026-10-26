import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { useCallback, useEffect, useState } from "react";

import migrations from "../../drizzle/migrations";
import { db } from "../db/client";
import { seedDefaultData } from "../db/seed";

type MigrationStatus = "pending" | "success" | "error";

type MigrationState = {
  status: MigrationStatus;
  error: Error | null;
};

function toError(value: unknown): Error {
  return value instanceof Error ? value : new Error(String(value));
}

let migrationRun: Promise<void> | null = null;

function runMigrations(): Promise<void> {
  migrationRun ??= migrate(db, migrations)
    .then(() => {
      seedDefaultData(db);
    })
    .catch((error: unknown) => {
      migrationRun = null;
      throw error;
    });

  return migrationRun;
}

export function useDatabaseMigrations() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<MigrationState>({ status: "pending", error: null });

  useEffect(() => {
    let cancelled = false;

    setState({ status: "pending", error: null });

    runMigrations()
      .then(() => {
        if (!cancelled) setState({ status: "success", error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) setState({ status: "error", error: toError(error) });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  return { ...state, retry };
}
