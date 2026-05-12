import { useCallback } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ActionButton } from "../components/ActionButton";
import { FeatureChip } from "../components/FeatureChip";
import { colors, radii, shadows, spacing } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const goToAuth = useCallback(() => navigation.replace("Auth"), [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <LinearGradient colors={["#FFF8EE", "#F5F8FF"]} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.top}>
            <Text style={styles.badge}>TopSeller AI</Text>
            <Text style={styles.title}>ถ่าย 1 รูป{"\n"}แล้วทำให้พร้อมขาย</Text>
            <Text style={styles.subtitle}>
              ตัดพื้นหลัง เปลี่ยนฉาก ใส่โปรโมชัน และเขียนแคปชั่นไทยให้พร้อมโพสต์ในแอปเดียว
            </Text>
            <View style={styles.chips}>
              <FeatureChip label="ตัดพื้นหลังอัตโนมัติ" />
              <FeatureChip label="Template โปรไทย" />
              <FeatureChip label="AI เขียน Caption ไทย" />
            </View>
          </View>
          <View style={styles.actions}>
            <ActionButton label="เริ่มใช้งานฟรี" onPress={goToAuth} />
            <ActionButton label="มีบัญชีแล้ว เข้าสู่ระบบ" variant="secondary" onPress={goToAuth} />
            <Pressable style={styles.legalRow}>
              <Text style={styles.legalText}>
                การใช้งานถือว่ายอมรับ{" "}
                <Text style={styles.legalLink} onPress={() => navigation.navigate("Legal", { type: "terms" })}>
                  ข้อกำหนด
                </Text>
                {" "}และ{" "}
                <Text style={styles.legalLink} onPress={() => navigation.navigate("Legal", { type: "privacy" })}>
                  นโยบายความเป็นส่วนตัว
                </Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page
  },
  gradient: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "space-between"
  },
  top: {
    gap: spacing.lg,
    marginTop: spacing.xl
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surface,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
    ...shadows.card
  },
  title: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: "800",
    color: colors.text
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.muted
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  actions: {
    gap: spacing.sm,
    paddingBottom: spacing.lg
  },
  legalRow: {
    alignItems: "center",
    paddingTop: spacing.xs
  },
  legalText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 18
  },
  legalLink: {
    color: colors.primary,
    fontWeight: "600"
  }
});
