
import { Stack } from "expo-router";

export default function PublicStack() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='login'></Stack.Screen>
      <Stack.Screen name='register'></Stack.Screen>
    </Stack>
  );
}
