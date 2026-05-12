import { Animated, StyleSheet, Text, useAnimatedValue } from "react-native";
import { useEffect } from "react";

import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { spacing } from "../constants/theme";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isOnline ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [isOnline, opacity]);

  return (
    <Animated.View style={[styles.banner, { opacity }]} pointerEvents="none">
      <Text style={styles.text}>ไม่มีอินเทอร์เน็ต — บางฟีเจอร์อาจใช้ไม่ได้</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: "#1F2937",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center"
  },
  text: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600"
  }
});
