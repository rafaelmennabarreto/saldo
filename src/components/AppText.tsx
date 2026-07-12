import { Text, TextProps } from "react-native";

type AppTextProps = TextProps;

export function AppText({ children, className, ...rest }: AppTextProps) {
  return (
    <Text className={`text-white text-base ${className}`} {...rest}>
      {children}
    </Text>
  )
}
