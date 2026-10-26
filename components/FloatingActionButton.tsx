import { Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { twMerge } from "tailwind-merge";
import { getColors } from "../shared/utils/nativeWindUtils";

type FloatingActionButtonProps = {
  accessibilityLabel: string;
  onPress(): void;
  className?: string;
};

export function FloatingActionButton({
  accessibilityLabel,
  onPress,
  className,
}: FloatingActionButtonProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className={twMerge(
        "absolute bottom-6 right-4 size-14 items-center justify-center rounded-full bg-primary active:opacity-80",
        className,
      )}
      onPress={onPress}
    >
      <Plus size={26} color={colors.neutral900} />
    </Pressable>
  );
}
