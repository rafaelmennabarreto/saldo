import { FlatList, View } from 'react-native'
import { AppText } from './AppText'
import { useEffect, useRef, useState } from 'react'
import { getDayFromIsoString, getMonthNumber, getMonthString, getRangedMonths, getRangedYears, Month } from '../shared/utils/dateUtils'
import { AppButton } from './AppButton';
import { MonthPickerItem } from './MonthPickerItem';
import { Card } from './Card';

type MonthPickerProps = {
  currentDate?: Date;
  onApply?(selectedDate: Date): void;
  onCancel?(): void;
}

export function MonthPicker({ onApply, onCancel, currentDate = new Date() }: MonthPickerProps) {
  const yearsListRef = useRef<FlatList<number>>(null);
  const monthListRef = useRef<FlatList<Month>>(null);

  const [months] = useState(getRangedMonths());
  const [years] = useState(getRangedYears());

  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<Month>(getMonthString(currentDate.getMonth())!);

  useEffect(() => {
    const index = years.indexOf(selectedYear);

    if (index >= 0) {
      const isFirst = index === 0;
      const isLast = index === years.length - 1;

      yearsListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: isFirst || isLast ? 0 : 0.5,
      });
    }
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedMonth) return;

    const index = months.indexOf(selectedMonth);

    if (index >= 0) {
      const isFirst = index === 0;
      const isLast = index === years.length - 1;

      monthListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: isFirst || isLast ? 0 : 0.5,
      });
    }
  }, [selectedMonth]);

  useEffect(() => {
    console.log('oi');
  }, [currentDate])

  function apply() {
    const day = getDayFromIsoString(currentDate.toISOString());
    const monthNumber = getMonthNumber(selectedMonth);

    const newDate = new Date(selectedYear, monthNumber, day);
    onApply?.(newDate);
  }

  return (
    <View className='flex-1 bg-neutral-900 rounded-lg border border-neutral-800'>
      <View className='border-b border-neutral-800 bg-neutral-850 px-5 py-4'>
        <AppText className='text-[16px]'> Selecionar mes e ano </AppText>
      </View>

      <Card className='flex-1 flex-row m-5 bg-neutral-850 border border-neutral-800'>
        <View className="flex-1 px-3 py-2">
          <AppText className='border-b border-neutral-800 mb-2 dark:text-[#94A3B8]'>Mes</AppText>
          <MonthPickerItem data={months} ref={monthListRef} selectedItem={selectedMonth} onPress={(item) => setSelectedMonth(item)} />
        </View>

        <View className="flex-1 px-3 py-2">
          <AppText className='border-b border-neutral-800 mb-2 dark:text-[#94A3B8]'>Ano</AppText>
          <MonthPickerItem data={years} ref={yearsListRef} selectedItem={selectedYear} onPress={(item) => setSelectedYear(item)} />
        </View>
      </Card>

      <View className='gap-2 border-t border-neutral-800 bg-neutral-850 p-5'>
        <View className='flex-row gap-2'>
          <AppText className='dark:text-[#94A3B8]'>Periodo:</AppText>
          <AppText className='w-[100%] font-bold'>{selectedMonth} {selectedYear} </AppText>
        </View>

        <View className='flex-row gap-2'>
          <AppButton className='flex-1' variant='secondary' onPress={() => onCancel?.()} text="cancelar" />
          <AppButton className='flex-1' onPress={apply} text="aplicar" />
        </View>
      </View>
    </View>
  )
}
