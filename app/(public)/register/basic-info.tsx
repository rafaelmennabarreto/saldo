import { AppButton } from "@components/AppButton";
import { AppTextInput } from "@components/AppInput";
import { Card } from "@components/Card";
import { useRegister } from "@context/RegisterContext";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function BasicInfo() {
  const router = useRouter();
  const { registerData, updateRegisterData } = useRegister();

  const handleContinue = () => {
    router.push("/register/user-info");
  };

  return (
    <View className="flex-1">
      <Card className="w-full gap-4">
        <AppTextInput
          label="Nome"
          value={registerData.name}
          onChangeText={(text) => updateRegisterData({ name: text })}
        />
        <AppTextInput
          label="E-mail"
          value={registerData.email}
          onChangeText={(text) => updateRegisterData({ email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppButton text="Continuar" icon="arrow-right-thick" onPress={handleContinue} />
      </Card>
    </View>
  );
}
