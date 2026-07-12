import { AppButton } from "@components/AppButton";
import { AppTextInput } from "@components/AppInput";
import { Card } from "@components/Card";
import { Dimensions, TouchableOpacity, View } from "react-native";
import ImageBackground from "react-native-css/components/ImageBackground";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import bkg from "../../assets/screen.png"
import { AppText } from "@components/AppText";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("screen")

export default function Login() {
  const router = useRouter();

  const gotoRegister = () => {
    router.push('/register');
  }

  return (
    <View className="flex-1 items-center  bg-background">
      <ImageBackground source={bkg}
        style={{
          position: "absolute",
          height: height,
          alignSelf: 'flex-start',
          width: "60%",
          top: 0,
          right: -95,
          opacity: 0.4
        }} resizeMode="cover" />
      <View className="bg-transparent flex-1 justify-center p-6">
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', gap: 24 }}
          bottomOffset={80}
        >
          <AppText className="text-3xl!">Bem vindo ao saldo, seu app de finanças</AppText>

          <Card className="justify-between gap-6">
            <AppTextInput label="E-mail" icon="email-outline" />
            <AppTextInput label="Senha" icon="lock-outline" type="password" />
            <AppButton className="mt-4" icon="arrow-right" text="Entrar" />
          </Card>

          <View className="flex-row gap-2 justify-center">
            <AppText className="text-lg">Não tem uma conta?</AppText>

            <TouchableOpacity onPress={gotoRegister}>
              <AppText className="text-lg text-orange-200!">Cadastre-se</AppText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View >
    </View>
  )
}
