export function splitInstallments(totalCents: number, count: number): number[] {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error("Installment count must be a positive integer.");
  }

  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new Error("Installment total must be a non-negative integer in cents.");
  }

  const baseAmount = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  return Array.from({ length: count }, (_, index) => baseAmount + (index < remainder ? 1 : 0));
}
