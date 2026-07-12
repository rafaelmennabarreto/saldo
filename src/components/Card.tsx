import { PropsWithChildren } from "react";
import { View } from "react-native";

type CardProps = PropsWithChildren & {
  className?: string
};

export function Card({ children, className }: CardProps) {
  return (
    <View className={`bg-neutral-900 rounded-xl p-6 ${className}`} >
      {children}
    </ View>
  )
}
