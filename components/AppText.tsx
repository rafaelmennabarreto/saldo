import { PropsWithChildren, ReactElement } from "react";
import { Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { twMerge } from "tailwind-merge";

type AppTextProps = {
  className?: string;
  icon?: ReactElement<React.ComponentProps<LucideIcon>>;
  numberOfLines?: number;
} & PropsWithChildren;

export function AppText({ children, className, icon: Icon, numberOfLines }: AppTextProps) {
  return (
    <View className="flex-row items-center">
      {Icon}
      <Text className={twMerge("text-white", className)} numberOfLines={numberOfLines}>
        {children}
      </Text>
    </View>
  );
}
