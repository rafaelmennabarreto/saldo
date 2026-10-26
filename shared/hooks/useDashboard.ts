import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { db } from "../db/client";
import { selectAccounts } from "../db/queries/accounts";
import { selectMonthlyTotals, selectRecentTransactions } from "../db/queries/transactions";
import { toTransactionListItem } from "../domain/transaction";

export function useDashboard(referenceMonth: string) {
  const totalsQuery = useMemo(() => selectMonthlyTotals(db, referenceMonth), [referenceMonth]);
  const recentQuery = useMemo(() => selectRecentTransactions(db, 5), []);
  const accountsQuery = useMemo(() => selectAccounts(db), []);

  const totals = useLiveQuery(totalsQuery, [referenceMonth]);
  const recent = useLiveQuery(recentQuery);
  const accounts = useLiveQuery(accountsQuery);

  const totalsByType = useMemo(() => {
    const map = new Map<string, number>();

    (totals.data ?? []).forEach((row) => {
      map.set(row.type, row.totalCents);
    });

    return map;
  }, [totals.data]);

  const incomeCents = totalsByType.get("income") ?? 0;
  const expenseCents = totalsByType.get("expense") ?? 0;

  const recentTransactions = useMemo(
    () => (recent.data ?? []).map((transaction) => toTransactionListItem(transaction)),
    [recent.data],
  );

  return {
    incomeCents,
    expenseCents,
    balanceCents: incomeCents - expenseCents,
    recentTransactions,
    accountsCount: accounts.data?.length ?? 0,
    error: totals.error ?? recent.error ?? accounts.error,
  };
}
