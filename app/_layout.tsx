import { AuthProvider, useAuth } from "@context/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { KeyboardProvider } from "react-native-keyboard-controller";

function RootNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn} >
        <Stack.Screen name="(private)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn} >
        <Stack.Screen name="(public)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function Layout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardProvider navigationBarTranslucent>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaView>
  )
}
