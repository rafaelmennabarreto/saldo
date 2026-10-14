import { Pressable, View } from "react-native";
import { AppText } from "../../components/AppText";
import { DatePicker } from "../../components/Datepicker";
import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { getColors } from "../../shared/utils/nativeWindUtils";
import { useColorScheme } from "nativewind";
import { getMonthString } from "../../shared/utils/dateUtils";
import { Eye, EyeOff } from "lucide-react-native/icons";
import { useAppStore } from "../../store/appStore";

export default function Main() {
  const [showDatePicker, setShowDatpicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { showBalance, toggleShowBalance } = useAppStore(state => state);

  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  function onApplyDate(date: Date): void {
    setSelectedDate(date);
    setShowDatpicker(false);
  }

  const selectedDateText = useMemo(() => {
    const month = getMonthString(selectedDate.getMonth());
    return `${month} de ${selectedDate.getFullYear()}`;
  }, [selectedDate])

  return (
    <View className='flex-1 p-4 bg-neutral-900' >
      <View className="flex-row justify-between">
        <Card className="self-start">
          <Pressable
            className="flex-row gap-2 items-center"
            onPress={() => setShowDatpicker(true)}>
            <AppText> {selectedDateText} </AppText>
            {
              showDatePicker
                ? <ChevronUp color={colors.neutral0} />
                : <ChevronDown color={colors.neutral0} />
            }
          </Pressable>
        </Card>

        {
          showBalance
            ? <EyeOff onPress={toggleShowBalance} color={colors.neutral0} />
            : <Eye onPress={toggleShowBalance} color={colors.neutral0} />
        }
      </View >

      <DatePicker visible={showDatePicker} onApply={onApplyDate} onClose={() => setShowDatpicker(false)} />
    </View >
  )
}
