import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useMemo } from "react";

import { db } from "../db/client";
import { selectCategories } from "../db/queries/categories";

export function useCategories() {
  const query = useMemo(() => selectCategories(db), []);
  const { data, error } = useLiveQuery(query);

  return { categories: data ?? [], error };
}
