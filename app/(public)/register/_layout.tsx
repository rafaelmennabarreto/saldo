import { AppText } from "@components/AppText";
import { Step, Stepper } from "@components/Stepper";
import { RegisterProvider } from "@context/RegisterContext";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Stack, usePathname, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { generateUUID } from "src/adapters/uniqueId";

const steps: Step[] = [
  { id: generateUUID(), name: "Informações basicas", url: "/register/basic-info" },
  { id: generateUUID(), name: "Dados do usuario", url: "/register/user-info" },
];

export default function RegisterLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const currentStep = pathname.includes("user-info") ? 2 : 1;

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/login");
    }
  };

  return (
    <RegisterProvider>
      <View className="flex-1 bg-background p-6 gap-6">
        {/* Custom Header */}
        <View className="flex-row items-center justify-center relative h-10">
          <TouchableOpacity
            onPress={handleGoBack}
            className="absolute left-0 p-1 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialDesignIcons name="arrow-left" color="#ffb68b" size={24} />
          </TouchableOpacity>
          <AppText className="text-lg font-semibold text-center">
            Crie sua conta
          </AppText>
        </View>

        <View className="gap-2">
          <Stepper steps={steps} currentStep={currentStep} />
          <AppText className="text-2xl font-bold mt-4">Bem-vindo ao Saldo</AppText>
          <AppText className="text-neutral-200!">
            Comece sua jornada para a liberdade financeira agora mesmo.
          </AppText>
        </View>

        <View className="flex-1">
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="basic-info" />
            <Stack.Screen name="user-info" />
          </Stack>
        </View>
      </View>
    </RegisterProvider>
  );
}
