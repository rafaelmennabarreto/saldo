import { AppButton } from "@components/AppButton";
import { AppTextInput } from "@components/AppInput";
import { AppText } from "@components/AppText";
import { Card } from "@components/Card";
import { useRegister } from "@context/RegisterContext";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { maskPhone } from "src/adapters/maskPhone";

export default function UserInfo() {
  const router = useRouter();
  const { registerData, updateRegisterData } = useRegister();

  const firstLetter = registerData.name ? registerData.name.trim().charAt(0).toUpperCase() : "?";

  const handlePhoneChange = (text: string) => {
    const formattedPhone = maskPhone(text);
    updateRegisterData({ phone: formattedPhone });
  };

  return (
    <View className="flex-1 items-center gap-6">
      {/* Avatar (96px container height, bg-orange-500, 32px letter height) */}
      <View className="w-24 h-24 rounded-full bg-orange-500 items-center justify-center">
        <AppText className="text-[32px] font-bold text-orange-950!">{firstLetter}</AppText>
      </View>

      <Card className="w-full gap-4">
        <AppTextInput
          label="Nome completo"
          value={registerData.name}
          onChangeText={(text) => updateRegisterData({ name: text })}
        />
        <AppTextInput
          label="E-mail"
          value={registerData.email}
          editable={false}
        />
        <AppTextInput
          label="Telefone"
          placeholder="(xx) xxxxx-xxxx"
          value={registerData.phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
        />
        <AppButton text="Finalizar" icon="check" onPress={() => router.replace("/login")} />
      </Card>
    </View>
  );
}
