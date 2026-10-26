import { ChevronDown, LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { getColors } from "../shared/utils/nativeWindUtils";
import { AppText } from "./AppText";

type SelectFieldProps = {
  icon: LucideIcon;
  label: string;
  hint?: string;
  accessibilityLabel: string;
  onPress(): void;
  className?: string;
};

export function SelectField({
  icon: Icon,
  label,
  hint,
  accessibilityLabel,
  onPress,
  className,
}: SelectFieldProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={twMerge(
        "flex-row items-center gap-3 rounded-2xl bg-neutral-850 px-4 py-3 active:opacity-80",
        className,
      )}
      onPress={onPress}
    >
      <Icon size={18} color={colors.primary} />

      <AppText className="flex-1 text-base" numberOfLines={1}>
        {label}
      </AppText>

      {hint ? (
        <AppText className="text-xs text-neutral-400" numberOfLines={1}>
          {hint}
        </AppText>
      ) : null}

      <ChevronDown size={16} color={colors.neutral400} />
    </Pressable>
  );
}
