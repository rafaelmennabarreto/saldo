import { PropsWithChildren } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";

type CardProps = {
  className?: string;
  onPress?(): void;
};

export function Card({ children, className, onPress }: PropsWithChildren<CardProps>) {
  return (
    <View className={twMerge("rounded-[24px] bg-neutral-800 p-2", className)}>{children}</View>
  );
}
