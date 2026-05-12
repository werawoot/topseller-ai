import "react-native-url-polyfill/auto";

import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import { ErrorBoundary } from "./src/components/ErrorBoundary";
import { OfflineBanner } from "./src/components/OfflineBanner";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { configureRevenueCat } from "./src/services/revenueCat";
import { initSentry } from "./src/services/sentry";

SplashScreen.preventAutoHideAsync();

initSentry();

export default function App() {
  useEffect(() => {
    configureRevenueCat();
  }, []);

  return (
    <ErrorBoundary fallbackTitle="แอปเกิดข้อผิดพลาด กรุณาลองใหม่">
      <View style={styles.root}>
        <RootNavigator onReady={() => SplashScreen.hideAsync()} />
        <OfflineBanner />
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 }
});
