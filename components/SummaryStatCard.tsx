import { ReactNode } from "react";
import { View } from "react-native";
import { ArrowDown, ArrowUp } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { twMerge } from "tailwind-merge";
import { fromCents } from "../shared/domain/money";
import { getColors } from "../shared/utils/nativeWindUtils";
import { formatCurrency } from "../shared/utils/currencyUtils";
import { AppText } from "./AppText";
import { Card } from "./Card";

type SummaryStatCardProps = {
  variant: "income" | "expense";
  title: string;
  amountCents: number;
  hidden?: boolean;
  note: ReactNode;
};

const variantStyles = {
  income: {
    iconContainer: "bg-teal-800",
    amount: "text-primary",
  },
  expense: {
    iconContainer: "bg-plum-800",
    amount: "text-coral-300",
  },
} as const;

export function SummaryStatCard({
  variant,
  title,
  amountCents,
  hidden,
  note,
}: SummaryStatCardProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  const isIncome = variant === "income";
  const Icon = isIncome ? ArrowUp : ArrowDown;
  const styles = variantStyles[variant];

  return (
    <Card className="flex-1 gap-2 p-4">
      <View
        className={twMerge("size-9 items-center justify-center rounded-full", styles.iconContainer)}
      >
        <Icon size={18} color={isIncome ? colors.primary : colors.coral300} />
      </View>

      <AppText className="text-xs text-neutral-400">{title}</AppText>

      <AppText className={twMerge("text-xl font-bold", styles.amount)}>
        {hidden ? "R$ ••••" : formatCurrency(fromCents(amountCents))}
      </AppText>

      <View className="mt-auto">{note}</View>
    </Card>
  );
}
