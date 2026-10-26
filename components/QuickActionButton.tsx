import { Pressable, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { getColors } from "../shared/utils/nativeWindUtils";
import { AppText } from "./AppText";

type QuickActionButtonProps = {
  icon: LucideIcon;
  label: string;
  onPress(): void;
};

export function QuickActionButton({ icon: Icon, label, onPress }: QuickActionButtonProps) {
  const { colorScheme } = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-1 items-center gap-2 rounded-2xl bg-neutral-850 px-1 py-3 active:opacity-80"
      onPress={onPress}
    >
      <View className="size-9 items-center justify-center rounded-full bg-neutral-800">
        <Icon size={18} color={colors.primary} />
      </View>

      <AppText className="text-center text-xs leading-4">{label}</AppText>
    </Pressable>
  );
}
