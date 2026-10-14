import { Calendar, DateData } from "react-native-calendars";
import { getColors } from "../shared/utils/nativeWindUtils";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { AppText } from "./AppText";
import {
  getDateOnly,
  getDayFromIsoString,
  getMonthString,
  newDateFromString,
  stringToDateString,
} from "../shared/utils/dateUtils";
import { MonthPicker } from "./MonthPicker";
import { Card } from "./Card";
import { AppButton } from "./AppButton";
import { CalendarIcon } from "lucide-react-native";

type DatePickerProps = {
  visible?: boolean;
  onApply?(date: Date): void;
  onClose?(): void;
};

export function DatePicker({ visible, onApply, onClose }: DatePickerProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  const [selectedDateString, setSelectedDateString] = useState(getDateOnly(new Date()));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);

  const selectedDate = useMemo(() => {
    return new Date(selectedDateString);
  }, [selectedDateString]);

  function handleDateChange(date: DateData): void {
    setSelectedDateString(date.dateString);
  }

  function formatMonth(date: string) {
    const newDate = new Date(date);
    const month = newDate.getMonth();
    const year = newDate.getFullYear();
    return `${getMonthString(month)} ${year}`;
  }

  function openMonthPicker(value: boolean) {
    setShowMonthPicker(value);
  }

  function updateSelectedDate(date: Date) {
    const day = getDayFromIsoString(date.toISOString());
    const month = date.getMonth();
    const year = date.getFullYear();

    const updatedDate = new Date(year, month, day);
    const newDateString = getDateOnly(updatedDate);

    setSelectedDateString(newDateString);
    setShowMonthPicker(false);
  }

  function onApplyDate(): void {
    const date = newDateFromString(selectedDateString);
    onApply?.(date);
  }

  function applyFixedDate(relativeDays: "yesterday" | "today" | "tomorrow") {
    const date = new Date();

    switch (relativeDays) {
      case "yesterday":
        date.setDate(date.getDate() - 1);
        break;

      case "tomorrow":
        date.setDate(date.getDate() + 1);
        break;
    }

    const dateString = getDateOnly(date);
    setSelectedDateString(dateString);
    setCalendarKey((prev) => prev + 1);
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      className="flex-1"
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/80 px-2">
        {showMonthPicker ? (
          <View className="h-[60%]">
            <MonthPicker
              currentDate={selectedDate}
              onApply={updateSelectedDate}
              onCancel={() => onClose?.()}
            />
          </View>
        ) : (
          <Card className="p-0">
            <View className="border-b border-b-neutral-850 px-4 py-5">
              <View className="flex-row items-center gap-2 ">
                <View className="size-9 items-center justify-center rounded-xl border border-primary bg-neutral-875">
                  <CalendarIcon color={colors.primary} size={18} />
                </View>
                <AppText className="text-lg">Selecionar data</AppText>
              </View>
            </View>

            <View className="mt-4 flex-row gap-3 px-4">
              <AppButton
                className="h-8 flex-1 p-0"
                variant="dark"
                text="Ontem"
                onPress={() => applyFixedDate("yesterday")}
              />
              <AppButton
                className="h-8 flex-1 p-1"
                variant="dark"
                text="Hoje"
                onPress={() => applyFixedDate("today")}
              />
              <AppButton
                className="h-8 flex-1 p-1"
                variant="dark"
                text="Amanhã"
                onPress={() => applyFixedDate("tomorrow")}
              />
            </View>

            <Calendar
              key={`${colorScheme}-${calendarKey}`}
              current={selectedDateString}
              onDayPress={handleDateChange}
              markedDates={{
                [selectedDateString]: { selected: true, disableTouchEvent: true },
              }}
              theme={{
                backgroundColor: colors.primary,
                calendarBackground: "transparent",
                textSectionTitleColor: "#64748B",
                selectedDayBackgroundColor: colors.primary,
                selectedDayTextColor: colors.neutral900,
                todayTextColor: colors.primary,
                dayTextColor: "white",
                textDisabledColor: "#CBD5E1",
              }}
              renderHeader={(date) => {
                return (
                  <Pressable onPress={() => openMonthPicker(true)}>
                    <AppText>{formatMonth(date)}</AppText>
                  </Pressable>
                );
              }}
            />

            <View className="border-t border-neutral-850 pt-5">
              <View className="mx-5 gap-1 rounded-2xl bg-neutral-850 p-3">
                <AppText className="text-neutral-400"> data escolhida </AppText>
                <AppText> {stringToDateString(selectedDateString).toString()} </AppText>
              </View>
            </View>

            <View className="m-5 flex-row gap-3">
              <AppButton
                className="flex-1"
                text="Cancelar"
                variant="secondary"
                onPress={() => onClose?.()}
              />
              <AppButton className="flex-1" text="Aplicar data" onPress={onApplyDate} />
            </View>
          </Card>
        )}
      </View>
    </Modal>
  );
}
