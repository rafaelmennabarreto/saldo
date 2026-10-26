import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { db } from "../db/client";
import { selectTransactions } from "../db/queries/transactions";
import { toTransactionListItem } from "../domain/transaction";

export function useTransactions() {
  const query = useMemo(() => selectTransactions(db), []);
  const { data, error, updatedAt } = useLiveQuery(query);

  const transactions = useMemo(
    () => (data ?? []).map((transaction) => toTransactionListItem(transaction)),
    [data],
  );

  return { transactions, error, updatedAt };
}
