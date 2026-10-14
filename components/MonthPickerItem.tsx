import { RefObject } from "react";
import { FlatList, Pressable } from "react-native";
import { AppText } from "./AppText";
import { Month } from "../shared/utils/dateUtils";

type MonthPickerItemProp<T> = {
  data: T[];
  ref: RefObject<FlatList | null>;
  selectedItem: T | undefined;
  onPress(value: T): void;
};

export function MonthPickerItem<T extends number | Month>({
  data,
  ref,
  selectedItem,
  onPress,
}: MonthPickerItemProp<T>) {
  return (
    <FlatList
      data={data}
      className="flex-1"
      ref={ref}
      renderItem={(item) => {
        const isSelected = selectedItem === item.item;

        return (
          <Pressable
            className={`
                  ${isSelected && "dark:bg-primary"} 
                  h-[32px] justify-center rounded-lg font-bold
                `}
            onPress={() => onPress(item.item)}
          >
            <AppText className={`font-bold ${isSelected && "dark:text-neutral-900"}`}>
              {item.item}
            </AppText>
          </Pressable>
        );
      }}
      keyExtractor={(item) => item?.toString() ?? ""}
      getItemLayout={(_, index) => ({
        length: 32,
        offset: 32 * index,
        index,
      })}
    />
  );
}
