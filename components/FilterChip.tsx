import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { AppText } from "./AppText";

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress(): void;
  className?: string;
};

export function FilterChip({ label, selected, onPress, className }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      className={twMerge(
        "rounded-full px-3 py-1.5 active:opacity-80",
        selected ? "bg-primary" : "bg-neutral-850",
        className,
      )}
      hitSlop={4}
      onPress={onPress}
    >
      <AppText
        className={twMerge(
          "text-xs font-semibold",
          selected ? "text-neutral-900" : "text-neutral-400",
        )}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
