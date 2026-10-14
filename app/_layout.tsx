import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, StatusBarStyle } from "react-native";
import { useColorScheme } from "nativewind";
import { getColors } from "../shared/utils/nativeWindUtils";
import "../global.css";
import "../shared/config/calendarsLocale";
import { useAppStore } from "../store/appStore";

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const theme = useAppStore((state) => state.theme);

  setColorScheme(theme || "dark");

  const colors = getColors(colorScheme);
  const barStyle: StatusBarStyle = colorScheme === "light" ? "dark-content" : "light-content";

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={colors.neutral900} />
      <SafeAreaView className="flex-1 dark:bg-neutral-900">
        <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)" />
      </SafeAreaView>
    </>
  );
}
