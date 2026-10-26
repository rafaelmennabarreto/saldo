export const financeColors = {
  primary: {
    iconBackground: "bg-teal-800",
    text: "text-primary",
    border: "border-primary",
  },
  coral300: {
    iconBackground: "bg-plum-800",
    text: "text-coral-300",
    border: "border-coral-300",
  },
  secondary: {
    iconBackground: "bg-secondary",
    text: "text-secondary",
    border: "border-secondary",
  },
  tertiary: {
    iconBackground: "bg-tertiary",
    text: "text-tertiary",
    border: "border-tertiary",
  },
  neutral400: {
    iconBackground: "bg-neutral-800",
    text: "text-neutral-400",
    border: "border-neutral-400",
  },
} as const;

export type FinanceColor = keyof typeof financeColors;

export function isFinanceColor(color: string): color is FinanceColor {
  return color in financeColors;
}

export function getFinanceColor(color: string) {
  return isFinanceColor(color) ? financeColors[color] : financeColors.neutral400;
}
