import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { db } from "../db/client";
import { selectAccounts } from "../db/queries/accounts";

export function useAccounts() {
  const query = useMemo(() => selectAccounts(db), []);
  const { data, error } = useLiveQuery(query);

  return { accounts: data ?? [], error };
}
