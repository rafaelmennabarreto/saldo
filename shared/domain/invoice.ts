import { getReferenceMonth, newDateFromString } from "../utils/dateUtils";

export function getInvoiceMonth(purchaseDate: string, closingDay: number): string {
  if (!Number.isInteger(closingDay) || closingDay < 1 || closingDay > 31) {
    throw new Error("Closing day must be an integer between 1 and 31.");
  }

  const purchase = newDateFromString(purchaseDate);
  const lastDayOfMonth = new Date(purchase.getFullYear(), purchase.getMonth() + 1, 0).getDate();
  const effectiveClosingDay = Math.min(closingDay, lastDayOfMonth);
  const closesThisMonth = purchase.getDate() < effectiveClosingDay;

  const invoiceMonth = new Date(
    purchase.getFullYear(),
    purchase.getMonth() + (closesThisMonth ? 0 : 1),
    1,
  );

  return getReferenceMonth(invoiceMonth);
}
