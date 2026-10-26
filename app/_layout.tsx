import { Stack } from "expo-router";
import { Database, RotateCcw, TriangleAlert } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ActivityIndicator, StatusBar, StatusBarStyle, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import "../global.css";
import "../shared/config/calendarsLocale";

import { AppButton } from "../components/AppButton";
import { AppText } from "../components/AppText";
import { Card } from "../components/Card";
import { useDatabaseMigrations } from "../shared/hooks/useDatabaseMigrations";
import { getColors } from "../shared/utils/nativeWindUtils";
import { useAppStore } from "../store/appStore";

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const theme = useAppStore((state) => state.theme);
  const { status, error, retry } = useDatabaseMigrations();

  setColorScheme(theme || "dark");

  const colors = getColors(colorScheme);
  const barStyle: StatusBarStyle = colorScheme === "light" ? "dark-content" : "light-content";

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={colors.neutral900} />
      <SafeAreaView className="flex-1 dark:bg-neutral-900">
        {status === "success" ? (
          <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)" />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            {status === "pending" ? (
              <View className="items-center gap-4">
                <View className="size-14 items-center justify-center rounded-2xl bg-teal-800">
                  <Database size={24} color={colors.primary} />
                </View>
                <ActivityIndicator color={colors.primary} size="large" />
                <AppText className="text-sm text-neutral-400">Preparando seus dados...</AppText>
              </View>
            ) : (
              <Card className="w-full gap-4 rounded-[24px] bg-neutral-850 p-6">
                <View className="size-12 items-center justify-center rounded-2xl bg-plum-800">
                  <TriangleAlert size={22} color={colors.coral300} />
                </View>

                <View>
                  <AppText className="text-lg font-bold">Não foi possível abrir seus dados</AppText>
                  <AppText className="mt-1 text-sm leading-5 text-neutral-400">
                    Ocorreu um erro ao aplicar as migrações do banco local. Seus dados anteriores
                    não foram apagados.
                  </AppText>
                  {error ? (
                    <AppText className="mt-2 text-xs text-coral-300" numberOfLines={4}>
                      {error.message}
                    </AppText>
                  ) : null}
                </View>

                <AppButton
                  icon={<RotateCcw size={16} color={colors.neutral900} />}
                  onPress={retry}
                  text="Tentar novamente"
                />
              </Card>
            )}
          </View>
        )}
      </SafeAreaView>
    </>
  );
}
