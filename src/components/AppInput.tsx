import { TextInput, TextInputProps, View } from "react-native";
import { AppText } from "./AppText";
import { MaterialDesignIcons, MaterialDesignIconsIconName } from '@react-native-vector-icons/material-design-icons';
import { useState } from "react";

type AppTextInputProps = TextInputProps & {
  label?: string;
  icon?: MaterialDesignIconsIconName
  type?: 'password' | 'text'
};

export function AppTextInput({ label, icon, type }: AppTextInputProps) {
  const [hidePassword, setHidePassword] = useState(true);
  const useSecureTextEntry = type === 'password';

  const passWordIcon: MaterialDesignIconsIconName = hidePassword ? "eye" : "eye-off";

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <View>
      {label && <AppText>{label}</AppText>}

      <View className="flex-row items-center bg-neutral-900 border border-neutral-700 rounded-t-lg mt-3 p-3">
        {icon && <MaterialDesignIcons name={icon} color="#fff" size={20} />}
        <TextInput secureTextEntry={useSecureTextEntry && hidePassword} className="text-white flex-1 p-0 ml-2" />
        {useSecureTextEntry && <MaterialDesignIcons onPress={togglePasswordVisibility} name={passWordIcon} color="#fff" size={20} />}
      </View>
    </View>
  )
}

