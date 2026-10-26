import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { AppText } from "./AppText";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?(): void;
  className?: string;
};

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
  className,
}: SectionHeaderProps) {
  return (
    <View className={twMerge("flex-row items-center justify-between gap-3", className)}>
      <AppText className="text-base font-bold">{title}</AppText>

      {actionLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          className="active:opacity-70"
          hitSlop={8}
          onPress={onActionPress}
        >
          <AppText className="text-sm font-semibold text-primary">{actionLabel}</AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
