type FormatCurrencyOptions = {
  showSign?: boolean;
};

export function parseAmountInput(value: string): number {
  const normalized = value.trim().replace(/\s/g, "");

  if (!normalized) return 0;

  const parsed = normalized.includes(",")
    ? Number(normalized.replace(/\./g, "").replace(",", "."))
    : Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatAmountInput(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function formatCurrency(value: number, options?: FormatCurrencyOptions): string {
  const absolute = Math.abs(value);
  const [integer, decimal] = absolute.toFixed(2).split(".");
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const sign = options?.showSign && value !== 0 ? (value > 0 ? "+" : "-") : value < 0 ? "-" : "";

  return `${sign}R$ ${formattedInteger},${decimal}`;
}
