export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function sumCents(...values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function isPositiveCents(cents: number): boolean {
  return Number.isFinite(cents) && cents > 0;
}
