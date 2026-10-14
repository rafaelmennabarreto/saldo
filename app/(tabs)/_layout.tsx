import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Resumo", tabBarIcon(props) {} }} />
      <Tabs.Screen name="sobre" options={{ title: "Sobre", tabBarIcon(props) {} }} />
    </Tabs>
  );
}
