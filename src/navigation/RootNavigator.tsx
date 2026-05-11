import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthScreen } from "../screens/AuthScreen";
import { PaywallScreen } from "../screens/PaywallScreen";
import { EditorScreen } from "../screens/EditorScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { LegalScreen } from "../screens/LegalScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { ProjectsScreen } from "../screens/ProjectsScreen";
import { colors } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = { onReady?: () => void };

export function RootNavigator({ onReady }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.page }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer onReady={onReady}>
      <Stack.Navigator
        initialRouteName={user ? "Home" : "Onboarding"}
        screenOptions={{
          headerStyle: { backgroundColor: colors.page },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: "800", color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.page }
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Editor" component={EditorScreen} options={{ title: "แต่งรูปสินค้า", headerBackTitle: "หน้าหลัก" }} />
            <Stack.Screen name="Paywall" component={PaywallScreen} options={{ title: "อัพเกรด Pro", headerBackTitle: "กลับ", presentation: "modal" }} />
            <Stack.Screen name="Projects" component={ProjectsScreen} options={{ title: "โปรเจกต์ของฉัน", headerBackTitle: "หน้าหลัก" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Legal" component={LegalScreen} options={({ route }) => ({ title: route.params.type === "privacy" ? "นโยบายความเป็นส่วนตัว" : "ข้อกำหนดการใช้งาน", headerBackTitle: "กลับ" })} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
