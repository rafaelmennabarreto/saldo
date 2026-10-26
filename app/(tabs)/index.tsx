import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useColorScheme } from "nativewind";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Eye,
  EyeOff,
  Landmark,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { DatePicker } from "../../components/Datepicker";
import { FloatingActionButton } from "../../components/FloatingActionButton";
import { QuickActionButton } from "../../components/QuickActionButton";
import { SectionHeader } from "../../components/SectionHeader";
import { SummaryStatCard } from "../../components/SummaryStatCard";
import { TransactionListItem } from "../../components/TransactionListItem";
import { fromCents } from "../../shared/domain/money";
import { useDashboard } from "../../shared/hooks/useDashboard";
import { formatCurrency } from "../../shared/utils/currencyUtils";
import { getMonthString, getReferenceMonth } from "../../shared/utils/dateUtils";
import { getColors } from "../../shared/utils/nativeWindUtils";
import { useAppStore } from "../../store/appStore";

function showComingSoon(feature: string) {
  Alert.alert(feature, "Em breve esta funcionalidade estará disponível.");
}

export default function Resumo() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const showBalance = useAppStore((state) => state.showBalance);
  const toggleShowBalance = useAppStore((state) => state.toggleShowBalance);

  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  const hidden = !showBalance;

  const selectedDateText = useMemo(() => {
    const month = getMonthString(selectedDate.getMonth());
    return `${month ?? ""} de ${selectedDate.getFullYear()}`;
  }, [selectedDate]);

  const referenceMonth = useMemo(() => getReferenceMonth(selectedDate), [selectedDate]);
  const { incomeCents, expenseCents, balanceCents, recentTransactions, accountsCount } =
    useDashboard(referenceMonth);

  function onApplyDate(date: Date): void {
    setSelectedDate(date);
    setShowDatePicker(false);
  }

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pb-28 pt-3">
          <View>
            <View className="flex-row items-center gap-2">
              <View className="size-8 items-center justify-center rounded-xl bg-teal-800">
                <Wallet size={16} color={colors.primary} />
              </View>
              <AppText className="text-xs font-extrabold tracking-widest">FINANÇAS</AppText>
            </View>

            <AppText className="mt-2 text-xl font-bold">Resumo</AppText>
          </View>

          <View className="mt-5 flex-row items-center justify-between gap-3">
            <Card className="rounded-full p-0">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Selecionar período. ${selectedDateText}`}
                className="flex-row items-center gap-2 py-2 pl-3 pr-2 active:opacity-80"
                hitSlop={4}
                onPress={() => setShowDatePicker(true)}
              >
                <CalendarDays size={16} color={colors.primary} />
                <AppText className="text-sm">{selectedDateText}</AppText>
                {showDatePicker ? (
                  <ChevronUp size={16} color={colors.neutral400} />
                ) : (
                  <ChevronDown size={16} color={colors.neutral400} />
                )}
              </Pressable>
            </Card>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showBalance ? "Ocultar valores" : "Mostrar valores"}
              accessibilityState={{ selected: showBalance }}
              className="size-10 items-center justify-center rounded-full bg-neutral-850 active:opacity-80"
              hitSlop={4}
              onPress={toggleShowBalance}
            >
              {showBalance ? (
                <Eye size={18} color={colors.neutral0} />
              ) : (
                <EyeOff size={18} color={colors.neutral400} />
              )}
            </Pressable>
          </View>

          <DatePicker
            visible={showDatePicker}
            onApply={onApplyDate}
            onClose={() => setShowDatePicker(false)}
          />

          <Card className="mt-4 gap-3 rounded-[24px] bg-neutral-850 p-5">
            <View className="flex-row items-center justify-between gap-3">
              <View className="flex-1">
                <AppText className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Resultado do período
                </AppText>
              </View>

              <View className="flex-row items-center gap-1.5 rounded-full bg-neutral-875 px-2 py-1">
                <View className="size-1.5 rounded-full bg-primary" />
                <AppText className="text-[10px] font-medium text-primary">Atualizado</AppText>
              </View>
            </View>

            <AppText className="text-5xl font-extrabold tracking-tight">
              {showBalance ? formatCurrency(fromCents(balanceCents)) : "R$ ••••••"}
            </AppText>

            <View className="flex-row items-center gap-2">
              <Landmark size={14} color={colors.neutral400} />
              <AppText className="text-sm text-neutral-400">
                {accountsCount} {accountsCount === 1 ? "conta cadastrada" : "contas cadastradas"}
              </AppText>
            </View>
          </Card>

          <View className="mt-3 flex-row gap-3">
            <SummaryStatCard
              variant="income"
              title="Total de receitas"
              amountCents={incomeCents}
              hidden={hidden}
              note={
                <AppText className="text-xs leading-4 text-neutral-400">
                  Receitas registradas no mês selecionado
                </AppText>
              }
            />

            <SummaryStatCard
              variant="expense"
              title="Total de despesas"
              amountCents={expenseCents}
              hidden={hidden}
              note={
                <AppText className="text-xs leading-4 text-neutral-400">
                  {balanceCents >= 0 ? "Economia de " : "Déficit de "}
                  {hidden ? "R$ ••••" : formatCurrency(fromCents(Math.abs(balanceCents)))}
                </AppText>
              }
            />
          </View>

          <SectionHeader
            className="mt-6"
            title="Acesso rápido"
            actionLabel="Personalizar"
            onActionPress={() => showComingSoon("Personalizar atalhos")}
          />

          <View className="mt-3 flex-row gap-2">
            <QuickActionButton
              icon={Plus}
              label="Novo lançamento"
              onPress={() => router.push("/lancamentos")}
            />
            <QuickActionButton
              icon={Receipt}
              label="Novo gasto fixo"
              onPress={() => showComingSoon("Novo gasto fixo")}
            />
            <QuickActionButton
              icon={Wallet}
              label="Contas"
              onPress={() => showComingSoon("Contas")}
            />
            <QuickActionButton
              icon={CreditCard}
              label="Fatura cartão"
              onPress={() => showComingSoon("Fatura de cartão")}
            />
          </View>

          <SectionHeader
            className="mt-6"
            title="Últimos lançamentos"
            actionLabel="Ver todos"
            onActionPress={() => router.push("/lancamentos")}
          />

          {recentTransactions.length === 0 ? (
            <Card className="mt-3 rounded-[24px] bg-neutral-850 p-6">
              <AppText className="text-center text-sm text-neutral-400">
                Nenhum lançamento registrado ainda. Use o botão abaixo para adicionar o primeiro.
              </AppText>
            </Card>
          ) : (
            <Card className="mt-3 overflow-hidden rounded-[24px] bg-neutral-850 p-0">
              {recentTransactions.map((transaction, index) => (
                <TransactionListItem
                  key={transaction.id}
                  transaction={transaction}
                  hidden={hidden}
                  isLast={index === recentTransactions.length - 1}
                />
              ))}
            </Card>
          )}
        </View>
      </ScrollView>

      <FloatingActionButton
        accessibilityLabel="Adicionar lançamento"
        onPress={() => router.push("/lancamentos")}
      />
    </View>
  );
}
