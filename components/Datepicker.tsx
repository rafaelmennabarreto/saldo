import { Calendar, DateData } from 'react-native-calendars'
import { getColors } from '../shared/utils/nativeWindUtils'
import { useColorScheme } from 'nativewind';
import { useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { getDateOnly, getDayFromIsoString, getMonthString, newDateFromString, stringToDateString } from '../shared/utils/dateUtils';
import { MonthPicker } from './MonthPicker';
import { Card } from './Card';
import { AppButton } from './AppButton';
import { CalendarIcon } from 'lucide-react-native';

type DatePickerProps = {
  visible?: boolean,
  onApply?(date: Date): void,
  onClose?(): void,
}

export function DatePicker({ visible, onApply, onClose }: DatePickerProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  const [selectedDateString, setSelectedDateString] = useState(getDateOnly(new Date()));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [calendarKey, setCalendarKey] = useState(0);

  const selectedDate = useMemo(() => {
    return new Date(selectedDateString);
  }, [selectedDateString])

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

  function applyFixedDate(relativeDays: 'yesterday' | 'today' | 'tomorrow') {
    const date = new Date();

    switch (relativeDays) {
      case 'yesterday':
        date.setDate(date.getDate() - 1);
        break;

      case 'tomorrow':
        date.setDate(date.getDate() + 1);
        break;
    }

    const dateString = getDateOnly(date);
    setSelectedDateString(dateString);
    setCalendarKey(prev => prev + 1);
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      className='flex-1'
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-center px-2 bg-black/80'>
        {showMonthPicker
          ? (
            <View className='h-[60%]'>
              <MonthPicker currentDate={selectedDate} onApply={updateSelectedDate} onCancel={() => onClose?.()} />
            </View>
          )
          : (
            <Card className='p-0'>
              <View className='border-b border-b-neutral-850 px-4 py-5'>
                <View className='flex-row items-center gap-2 '>
                  <View className='rounded-xl size-9 items-center justify-center bg-neutral-875 border border-primary'>
                    <CalendarIcon color={colors.primary} size={18} />
                  </View>
                  <AppText className='text-lg' >Selecionar data</AppText>
                </View>
              </View>

              <View className='flex-row gap-3 mt-4 px-4'>
                <AppButton className='flex-1 h-8 p-0' variant='dark' text='Ontem' onPress={() => applyFixedDate('yesterday')} />
                <AppButton className='flex-1 h-8 p-1' variant='dark' text='Hoje' onPress={() => applyFixedDate('today')} />
                <AppButton className='flex-1 h-8 p-1' variant='dark' text='Amanhã' onPress={() => applyFixedDate('tomorrow')} />
              </View>

              <Calendar
                key={`${colorScheme}-${calendarKey}`}
                current={selectedDateString}
                onDayPress={handleDateChange}
                markedDates={{
                  [selectedDateString]: { selected: true, disableTouchEvent: true }
                }}
                theme={{
                  backgroundColor: colors.primary,
                  calendarBackground: "transparent",
                  textSectionTitleColor: "#64748B",
                  selectedDayBackgroundColor: colors.primary,
                  selectedDayTextColor: colors.neutral900,
                  todayTextColor: colors.primary,
                  dayTextColor: 'white',
                  textDisabledColor: "#CBD5E1",
                }}
                renderHeader={(date) => {

                  return (
                    <Pressable onPress={() => openMonthPicker(true)}>
                      <AppText>
                        {formatMonth(date)}
                      </AppText>
                    </Pressable>
                  );
                }}
              />

              <View className='pt-5 border-t border-neutral-850'>
                <View className='gap-1 mx-5 p-3 bg-neutral-850 rounded-2xl'>
                  <AppText className='text-neutral-400'> data escolhida </AppText>
                  <AppText> {stringToDateString(selectedDateString).toString()} </AppText>
                </View>
              </View>

              <View className='flex-row m-5 gap-3'>
                <AppButton className='flex-1' text='Cancelar' variant='secondary' onPress={() => onClose?.()} />
                <AppButton className='flex-1' text='Aplicar data' onPress={onApplyDate} />
              </View>
            </Card>
          )
        }
      </View>
    </Modal >
  )
}
