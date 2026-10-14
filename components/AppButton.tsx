import { Pressable } from "react-native";
import { AppText } from "./AppText";
import { PropsWithChildren, ReactElement } from "react";
import { LucideIcon } from "lucide-react-native";
import { twMerge } from "tailwind-merge";

type AppButtonProp = {
  onPress?(): void;
  variant?: keyof typeof variants;
  icon?: ReactElement<React.ComponentProps<LucideIcon>>;
  className?: string;
  text: string;
};

const variants = {
  primary: "bg-primary active:opacity-80",
  secondary: "bg-neutral-850 active:opacity-80 border border-neutral-400",
  dark: "bg-neutral-850 active:opacity-80",
};

const textVariants: typeof variants = {
  primary: "dark:text-black",
  secondary: "text-white",
  dark: "text-white",
};

export function AppButton({
  onPress,
  variant = "primary",
  icon,
  className,
  text,
}: PropsWithChildren<AppButtonProp>) {
  return (
    <Pressable
      className={twMerge(
        "items-center justify-center rounded-lg py-3",
        variants[variant],
        className,
      )}
      onPress={() => onPress?.()}
    >
      <AppText icon={icon} className={`font-bold ${textVariants[variant]}`}>
        {text}
      </AppText>
    </Pressable>
  );
}
