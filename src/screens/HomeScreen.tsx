import { useCallback } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ActionButton } from "../components/ActionButton";
import { FeatureChip } from "../components/FeatureChip";
import { colors, radii, shadows, spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const RECENT_TIPS = [
  { id: "1", icon: "🛍️", text: "ถ่ายรูปสินค้าในแสงธรรมชาติ ได้ผลดีกว่าไฟใน" },
  { id: "2", icon: "🎨", text: "พื้นหลังพาสเทลช่วยให้สินค้าดูแพงและ clean" },
  { id: "3", icon: "✍️", text: "ใส่ราคาและ call to action ใน caption ทุกครั้ง" }
];

export function HomeScreen({ navigation }: Props) {
  const goToEditor = useCallback(() => navigation.navigate("Editor"), [navigation]);
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#FFF8EE", "#FFFDF9"]} style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>TopSeller AI</Text>
              <Pressable onPress={signOut} hitSlop={8}>
                <Text style={styles.signOut}>ออกจากระบบ</Text>
              </Pressable>
            </View>
            <Text style={styles.greeting}>สวัสดีครับ {user?.email?.split("@")[0]} 👋</Text>
            <Text style={styles.heroTitle}>พร้อมทำภาพสินค้าวันนี้ไหม?</Text>
          </View>
          <View style={styles.chips}>
            <FeatureChip label="ตัดพื้นหลัง" />
            <FeatureChip label="Template โปร" />
            <FeatureChip label="Caption AI" />
          </View>
          <ActionButton label="เริ่มแต่งรูปสินค้า" onPress={goToEditor} />
          <ActionButton label="โปรเจกต์ของฉัน" variant="secondary" onPress={() => navigation.navigate("Projects")} />
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>เคล็ดลับแม่ค้าออนไลน์</Text>
          <View style={styles.tips}>
            {RECENT_TIPS.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>แพ็กเกจ</Text>
          <View style={styles.planRow}>
            <View style={[styles.planCard, styles.planFree]}>
              <Text style={styles.planName}>Free</Text>
              <Text style={styles.planPrice}>ฟรี</Text>
              <Text style={styles.planDetail}>5 รูป/วัน</Text>
            </View>
            <View style={[styles.planCard, styles.planPro]}>
              <Text style={[styles.planName, { color: "#FFF" }]}>Pro</Text>
              <Text style={[styles.planPrice, { color: "#FFF" }]}>฿99/เดือน</Text>
              <Text style={[styles.planDetail, { color: "#FFDDB8" }]}>ไม่จำกัด</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.lg
  },
  hero: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card
  },
  heroTop: {
    gap: spacing.xs
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  signOut: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "600"
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surface,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 13
  },
  greeting: {
    fontSize: 15,
    color: colors.muted,
    marginTop: spacing.sm
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 34
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text
  },
  tips: {
    gap: spacing.sm
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  tipIcon: {
    fontSize: 22
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 22
  },
  planRow: {
    flexDirection: "row",
    gap: spacing.md
  },
  planCard: {
    flex: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border
  },
  planFree: {
    backgroundColor: colors.surface
  },
  planPro: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  planName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.muted
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text
  },
  planDetail: {
    fontSize: 13,
    color: colors.muted
  }
});
