import { Check, LucideIcon, X } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { getColors } from "../shared/utils/nativeWindUtils";
import { AppText } from "./AppText";
import { Card } from "./Card";

export type SelectOptionTone = "primary" | "coral300" | "neutral400";

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  hint?: string;
  icon: LucideIcon;
  tone?: SelectOptionTone;
};

type SelectModalProps = {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect(option: SelectOption): void;
  onClose(): void;
};

const toneBackgrounds = {
  primary: "bg-teal-800",
  coral300: "bg-plum-800",
  neutral400: "bg-neutral-800",
} as const;

export function SelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectModalProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center bg-black/80 px-4">
        <Card className="rounded-[24px] bg-neutral-800 p-0">
          <View className="flex-row items-center justify-between gap-3 border-b border-neutral-850 px-4 py-4">
            <AppText className="text-lg font-bold">{title}</AppText>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar seleção"
              className="size-9 items-center justify-center rounded-full bg-neutral-850 active:opacity-80"
              hitSlop={4}
              onPress={onClose}
            >
              <X size={16} color={colors.neutral400} />
            </Pressable>
          </View>

          <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = option.value === selectedValue;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: isSelected }}
                  className={twMerge(
                    "flex-row items-center gap-3 px-4 py-3 active:opacity-80",
                    isSelected && "bg-neutral-850",
                  )}
                  onPress={() => onSelect(option)}
                >
                  <View
                    className={twMerge(
                      "size-9 items-center justify-center rounded-full",
                      toneBackgrounds[option.tone ?? "primary"],
                    )}
                  >
                    <Icon size={16} color={colors[option.tone ?? "primary"]} />
                  </View>

                  <View className="flex-1">
                    <AppText className="text-sm font-semibold" numberOfLines={1}>
                      {option.label}
                    </AppText>

                    {option.description ? (
                      <AppText className="text-xs text-neutral-400" numberOfLines={1}>
                        {option.description}
                      </AppText>
                    ) : null}
                  </View>

                  {isSelected ? <Check size={18} color={colors.primary} /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
}
