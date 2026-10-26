import { PropsWithChildren } from "react";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { AppText } from "./AppText";

type FormFieldProps = {
  label: string;
  className?: string;
};

export function FormField({ children, label, className }: PropsWithChildren<FormFieldProps>) {
  return (
    <View className={twMerge("gap-2", className)}>
      <AppText className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        {label}
      </AppText>

      {children}
    </View>
  );
}
