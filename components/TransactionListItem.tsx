import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { twMerge } from "tailwind-merge";
import { fromCents } from "../shared/domain/money";
import type { TransactionListItemData } from "../shared/domain/transaction";
import { getColors } from "../shared/utils/nativeWindUtils";
import { formatCurrency } from "../shared/utils/currencyUtils";
import { getShortDateString } from "../shared/utils/dateUtils";
import { AppText } from "./AppText";

type TransactionListItemProps = {
  transaction: TransactionListItemData;
  hidden?: boolean;
  isLast?: boolean;
};

export function TransactionListItem({ transaction, hidden, isLast }: TransactionListItemProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  const isIncome = transaction.type === "income";
  const isPaid = transaction.status === "paid";
  const Icon = transaction.icon;
  const signedCents = isIncome ? transaction.amountCents : -transaction.amountCents;

  return (
    <View
      className={twMerge(
        "flex-row items-center gap-3 px-4 py-3",
        !isLast && "border-b border-neutral-800",
      )}
    >
      <View
        className={twMerge(
          "size-10 items-center justify-center rounded-full",
          isIncome ? "bg-neutral-875" : "bg-plum-800",
        )}
      >
        <Icon size={18} color={isIncome ? colors.primary : colors.coral300} />
      </View>

      <View className="flex-1">
        <AppText className="text-sm font-semibold" numberOfLines={1}>
          {transaction.title}
        </AppText>
        <AppText className="text-xs text-neutral-400" numberOfLines={1}>
          {transaction.time ?? getShortDateString(transaction.date)} - {transaction.account}
        </AppText>
      </View>

      <View className="items-end gap-1">
        <AppText
          className={twMerge(
            "text-base font-semibold",
            isIncome ? "text-primary" : "text-coral-300",
          )}
        >
          {hidden ? "••••" : formatCurrency(fromCents(signedCents), { showSign: true })}
        </AppText>

        <View
          className={twMerge("rounded-full px-2 py-0.5", isPaid ? "bg-neutral-875" : "bg-plum-800")}
        >
          <AppText
            className={twMerge(
              "text-[10px] font-medium",
              isPaid ? "text-primary" : "text-coral-300",
            )}
          >
            {isPaid ? "Pago" : "Em aberto"}
          </AppText>
        </View>
      </View>
    </View>
  );
}
