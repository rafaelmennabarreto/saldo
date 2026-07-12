import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { AppText } from "./AppText";
import { MaterialDesignIcons, MaterialDesignIconsIconName } from "@react-native-vector-icons/material-design-icons";

type AppButtonType = TouchableOpacityProps & {
  icon?: MaterialDesignIconsIconName;
  text?: string;
}

export function AppButton({ icon, className, text, ...rest }: AppButtonType) {
  return (
    <TouchableOpacity className={`flex-row items-center justify-center bg-primary-900 h-14 rounded-xl bg-orange-500 ${className}`} {...rest}>
      <AppText className="text-orange-950 font-bold">{text}</AppText>
      {icon && <MaterialDesignIcons className="ml-2" name={icon} color="#fff" size={20} />}
    </TouchableOpacity>
  )

}
