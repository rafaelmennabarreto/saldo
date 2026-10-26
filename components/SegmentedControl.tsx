import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { getColors } from "../shared/utils/nativeWindUtils";
import { AppText } from "./AppText";

export type SegmentedOptionTone = "neutral" | "income" | "expense";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  icon?: LucideIcon;
  tone?: SegmentedOptionTone;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange(value: T): void;
  className?: string;
};

const selectedStyles = {
  neutral: {
    container: "border-primary bg-neutral-875",
    text: "text-white",
    icon: "primary",
  },
  income: {
    container: "border-primary bg-teal-800",
    text: "text-primary",
    icon: "primary",
  },
  expense: {
    container: "border-coral-300 bg-plum-800",
    text: "text-coral-300",
    icon: "coral300",
  },
} as const;

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <View className={twMerge("flex-row gap-2", className)}>
      {options.map((option) => {
        const isSelected = option.value === value;
        const tone = selectedStyles[option.tone ?? "neutral"];
        const Icon = option.icon;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            className={twMerge(
              "flex-1 flex-row items-center justify-center gap-2 rounded-2xl border px-3 py-3 active:opacity-80",
              isSelected ? tone.container : "border-transparent bg-neutral-850",
            )}
            onPress={() => onChange(option.value)}
          >
            {Icon ? (
              <Icon size={16} color={isSelected ? colors[tone.icon] : colors.neutral400} />
            ) : null}

            <AppText
              className={twMerge(
                "text-sm font-semibold",
                isSelected ? tone.text : "text-neutral-400",
              )}
              numberOfLines={1}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
