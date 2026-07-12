import { Stack } from "expo-router";

export default function PrivateStack() {
  return (
    <Stack>
      <Stack.Screen name='home'></Stack.Screen>
    </Stack>
  );
}
