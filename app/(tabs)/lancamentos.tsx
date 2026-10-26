import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { useColorScheme } from "nativewind";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  FilePlus2,
  History,
  Receipt,
} from "lucide-react-native";
import { AppButton } from "../../components/AppButton";
import { AppText } from "../../components/AppText";
import { Card } from "../../components/Card";
import { DatePicker } from "../../components/Datepicker";
import { FilterChip } from "../../components/FilterChip";
import { FormField } from "../../components/FormField";
import { SegmentedControl } from "../../components/SegmentedControl";
import type { SegmentedOption } from "../../components/SegmentedControl";
import { SelectField } from "../../components/SelectField";
import { SelectModal } from "../../components/SelectModal";
import type { SelectOption, SelectOptionTone } from "../../components/SelectModal";
import { TransactionListItem } from "../../components/TransactionListItem";
import { db } from "../../shared/db/client";
import { createTransaction } from "../../shared/db/repositories/transactions";
import { isFinanceColor } from "../../shared/domain/colors";
import type { FinanceColor } from "../../shared/domain/colors";
import { getFinanceIcon } from "../../shared/domain/icons";
import { toCents } from "../../shared/domain/money";
import type {
  TransactionListItemData,
  TransactionStatus,
  TransactionType,
} from "../../shared/domain/transaction";
import { useAccounts } from "../../shared/hooks/useAccounts";
import { useCategories } from "../../shared/hooks/useCategories";
import { useTransactions } from "../../shared/hooks/useTransactions";
import {
  formatAmountInput,
  formatCurrency,
  parseAmountInput,
} from "../../shared/utils/currencyUtils";
import {
  formatDateToDisplay,
  getDateOnly,
  getRelativeDayLabel,
} from "../../shared/utils/dateUtils";
import { getColors } from "../../shared/utils/nativeWindUtils";

type FormView = "form" | "history";

type HistoryFilter = "all" | "open" | "paid" | "expense" | "income";

const viewOptions: SegmentedOption<FormView>[] = [
  { value: "form", label: "Novo registro", icon: FilePlus2 },
  { value: "history", label: "Histórico", icon: History },
];

const typeOptions: SegmentedOption<TransactionType>[] = [
  { value: "expense", label: "Despesa", icon: ArrowDown, tone: "expense" },
  { value: "income", label: "Receita", icon: ArrowUp, tone: "income" },
];

const statusOptions: SegmentedOption<TransactionStatus>[] = [
  { value: "open", label: "Em aberto", icon: Circle },
  { value: "paid", label: "Pago", icon: CheckCircle2 },
];

const historyFilters: { value: HistoryFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "open", label: "Em aberto" },
  { value: "paid", label: "Pagos" },
  { value: "expense", label: "Despesas" },
  { value: "income", label: "Receitas" },
];

const quickAmounts = [25, 50, 100, 500];

const accountTypeLabels: Record<string, string> = {
  checking: "Conta corrente",
  savings: "Poupança",
  cash: "Dinheiro em espécie",
  investment: "Investimento",
};

const toneByColor: Record<FinanceColor, SelectOptionTone> = {
  primary: "primary",
  coral300: "coral300",
  secondary: "primary",
  tertiary: "coral300",
  neutral400: "neutral400",
};

function getColorTone(color: string): SelectOptionTone {
  return isFinanceColor(color) ? toneByColor[color] : "neutral400";
}

export default function Lancamentos() {
  const [activeView, setActiveView] = useState<FormView>("form");

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<TransactionStatus>("open");
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [notes, setNotes] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");

  const { transactions } = useTransactions();
  const { categories } = useCategories();
  const { accounts } = useAccounts();

  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  const categoryOptions = useMemo<SelectOption[]>(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
        icon: getFinanceIcon(category.icon),
        tone: getColorTone(category.color),
      })),
    [categories],
  );

  const accountOptions = useMemo<SelectOption[]>(
    () =>
      accounts.map((account) => ({
        value: account.id,
        label: account.name,
        description: accountTypeLabels[account.type] ?? "Conta",
        hint: account.includeInTotal ? "No total" : "Fora do total",
        icon: getFinanceIcon(account.icon),
        tone: getColorTone(account.color),
      })),
    [accounts],
  );

  const selectedCategory =
    categoryOptions.find((option) => option.value === categoryId) ?? categoryOptions[0];
  const selectedAccount =
    accountOptions.find((option) => option.value === accountId) ?? accountOptions[0];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      switch (historyFilter) {
        case "open":
          return transaction.status === "open";
        case "paid":
          return transaction.status === "paid";
        case "expense":
          return transaction.type === "expense";
        case "income":
          return transaction.type === "income";
        default:
          return true;
      }
    });
  }, [transactions, historyFilter]);

  const transactionGroups = useMemo(() => {
    const groups = new Map<string, TransactionListItemData[]>();

    filteredTransactions.forEach((transaction) => {
      const items = groups.get(transaction.date) ?? [];
      groups.set(transaction.date, [...items, transaction]);
    });

    return Array.from(groups, ([date, items]) => ({
      date,
      label: getRelativeDayLabel(date),
      items,
    }));
  }, [filteredTransactions]);

  function addAmount(value: number): void {
    setAmount(formatAmountInput(parseAmountInput(amount) + value));
  }

  function handleSave(): void {
    const parsedAmount = parseAmountInput(amount);
    const amountCents = toCents(parsedAmount);

    if (amountCents <= 0) {
      Alert.alert("Valor inválido", "Informe um valor maior que zero para o lançamento.");
      return;
    }

    if (!description.trim()) {
      Alert.alert(
        "Descrição obrigatória",
        "Descreva o lançamento para identificá-lo no histórico.",
      );
      return;
    }

    if (!selectedCategory || !selectedAccount) {
      Alert.alert(
        "Cadastro incompleto",
        "Cadastre pelo menos uma categoria e uma conta antes de salvar o lançamento.",
      );
      return;
    }

    try {
      createTransaction(db, {
        type,
        status,
        amountCents,
        dueDate: getDateOnly(dueDate),
        description: description.trim(),
        categoryId: selectedCategory.value,
        accountId: selectedAccount.value,
        notes: notes.trim() || null,
      });
    } catch {
      Alert.alert(
        "Não foi possível salvar",
        "O lançamento não foi gravado. Verifique os dados e tente novamente.",
      );
      return;
    }

    setHistoryFilter("all");
    setAmount("");
    setDescription("");
    setNotes("");
    setType("expense");
    setStatus("open");
    setDueDate(new Date());
    setActiveView("history");

    Alert.alert("Lançamento salvo", "O lançamento foi adicionado ao histórico recente.");
  }

  return (
    <View className="flex-1 bg-neutral-900">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 pb-28 pt-3">
            <View>
              <View className="flex-row items-center gap-2">
                <View className="size-8 items-center justify-center rounded-xl bg-teal-800">
                  <Receipt size={16} color={colors.primary} />
                </View>
                <AppText className="text-xs font-extrabold tracking-widest">FINANÇAS</AppText>
              </View>

              <AppText className="mt-2 text-xl font-bold">Lançamentos</AppText>
            </View>

            <SegmentedControl<FormView>
              className="mt-5"
              options={viewOptions}
              value={activeView}
              onChange={setActiveView}
            />

            {activeView === "form" ? (
              <View className="mt-5 gap-5">
                <SegmentedControl<TransactionType>
                  options={typeOptions}
                  value={type}
                  onChange={setType}
                />

                <FormField label="Valor do lançamento">
                  <View className="flex-row items-center rounded-2xl bg-neutral-850 px-4 py-3">
                    <AppText className="mr-2 text-lg font-semibold text-neutral-400">R$</AppText>

                    <TextInput
                      accessibilityLabel="Valor do lançamento em reais"
                      className="flex-1 py-1 text-3xl font-extrabold text-white"
                      keyboardType="decimal-pad"
                      onChangeText={setAmount}
                      placeholder="0,00"
                      placeholderTextColor={colors.neutral400}
                      selectionColor={colors.primary}
                      value={amount}
                    />
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <Pressable
                        key={quickAmount}
                        accessibilityRole="button"
                        accessibilityLabel={`Adicionar ${formatCurrency(quickAmount)} ao valor`}
                        className="rounded-full bg-neutral-850 px-3 py-1.5 active:opacity-70"
                        hitSlop={4}
                        onPress={() => addAmount(quickAmount)}
                      >
                        <AppText className="text-xs font-semibold text-primary">
                          +{formatCurrency(quickAmount)}
                        </AppText>
                      </Pressable>
                    ))}
                  </View>
                </FormField>

                <FormField label="Status da transação">
                  <SegmentedControl<TransactionStatus>
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                  />
                </FormField>

                <FormField label="Data prevista / vencimento">
                  <SelectField
                    accessibilityLabel={`Selecionar data de vencimento. Data atual ${formatDateToDisplay(dueDate)}`}
                    icon={CalendarDays}
                    label={formatDateToDisplay(dueDate)}
                    onPress={() => setShowDatePicker(true)}
                  />
                </FormField>

                <FormField label="Descrição da transação">
                  <TextInput
                    accessibilityLabel="Descrição da transação"
                    className="rounded-2xl bg-neutral-850 px-4 py-3 text-base text-white"
                    maxLength={80}
                    onChangeText={setDescription}
                    placeholder="Ex.: Supermercado, salário, aluguel..."
                    placeholderTextColor={colors.neutral400}
                    selectionColor={colors.primary}
                    value={description}
                  />
                </FormField>

                <FormField label="Categoria">
                  {selectedCategory ? (
                    <SelectField
                      accessibilityLabel={`Selecionar categoria. Categoria atual ${selectedCategory.label}`}
                      icon={selectedCategory.icon}
                      label={selectedCategory.label}
                      onPress={() => setShowCategoryPicker(true)}
                    />
                  ) : (
                    <Card className="rounded-2xl bg-neutral-850 p-4">
                      <AppText className="text-sm text-neutral-400">
                        Nenhuma categoria ativa cadastrada.
                      </AppText>
                    </Card>
                  )}
                </FormField>

                <FormField label="Conta / origem dos fundos">
                  {selectedAccount ? (
                    <SelectField
                      accessibilityLabel={`Selecionar conta. Conta atual ${selectedAccount.label}`}
                      hint={selectedAccount.hint}
                      icon={selectedAccount.icon}
                      label={selectedAccount.label}
                      onPress={() => setShowAccountPicker(true)}
                    />
                  ) : (
                    <Card className="rounded-2xl bg-neutral-850 p-4">
                      <AppText className="text-sm text-neutral-400">
                        Nenhuma conta ativa cadastrada.
                      </AppText>
                    </Card>
                  )}
                </FormField>

                <FormField label="Observações / tags">
                  <TextInput
                    accessibilityLabel="Observações do lançamento"
                    className="min-h-[96px] rounded-2xl bg-neutral-850 px-4 py-3 text-base text-white"
                    multiline
                    onChangeText={setNotes}
                    placeholder="Informações adicionais, tags ou referências"
                    placeholderTextColor={colors.neutral400}
                    selectionColor={colors.primary}
                    textAlignVertical="top"
                    value={notes}
                  />
                </FormField>

                <AppButton
                  className="mt-1"
                  icon={<Check size={18} color={colors.neutral900} />}
                  onPress={handleSave}
                  text="Salvar lançamento"
                />
              </View>
            ) : (
              <View className="mt-5">
                <View className="flex-row items-center justify-between gap-3">
                  <AppText className="text-base font-bold">Histórico recente</AppText>
                  <AppText className="text-xs text-neutral-400">
                    {filteredTransactions.length} registros
                  </AppText>
                </View>

                <AppText className="mt-1 text-xs text-neutral-400">
                  Todos os lançamentos registrados
                </AppText>

                <View className="mt-3 flex-row flex-wrap gap-2">
                  {historyFilters.map((filter) => (
                    <FilterChip
                      key={filter.value}
                      label={filter.label}
                      selected={historyFilter === filter.value}
                      onPress={() => setHistoryFilter(filter.value)}
                    />
                  ))}
                </View>

                {transactionGroups.length === 0 ? (
                  <Card className="mt-5 rounded-[24px] bg-neutral-850 p-6">
                    <AppText className="text-center text-sm text-neutral-400">
                      Nenhum lançamento encontrado para este filtro.
                    </AppText>
                  </Card>
                ) : (
                  transactionGroups.map((group) => (
                    <View key={group.date} className="mt-5">
                      <AppText className="mb-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                        {group.label}
                      </AppText>

                      <Card className="overflow-hidden rounded-[24px] bg-neutral-850 p-0">
                        {group.items.map((transaction, index) => (
                          <TransactionListItem
                            key={transaction.id}
                            transaction={transaction}
                            isLast={index === group.items.length - 1}
                          />
                        ))}
                      </Card>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePicker
        visible={showDatePicker}
        onApply={(date) => {
          setDueDate(date);
          setShowDatePicker(false);
        }}
        onClose={() => setShowDatePicker(false)}
      />

      <SelectModal
        visible={showCategoryPicker}
        title="Selecionar categoria"
        options={categoryOptions}
        selectedValue={selectedCategory?.value}
        onSelect={(option) => {
          setCategoryId(option.value);
          setShowCategoryPicker(false);
        }}
        onClose={() => setShowCategoryPicker(false)}
      />

      <SelectModal
        visible={showAccountPicker}
        title="Selecionar conta"
        options={accountOptions}
        selectedValue={selectedAccount?.value}
        onSelect={(option) => {
          setAccountId(option.value);
          setShowAccountPicker(false);
        }}
        onClose={() => setShowAccountPicker(false)}
      />
    </View>
  );
}
