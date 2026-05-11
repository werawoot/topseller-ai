import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ActionButton } from "../components/ActionButton";
import { colors, radii, shadows, spacing } from "../constants/theme";
import { usePurchases } from "../hooks/usePurchases";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Paywall">;

const PRO_FEATURES = [
  { icon: "✂️", text: "ตัดพื้นหลังไม่จำกัด" },
  { icon: "🎨", text: "Template โปรโมชันทุกแบบ" },
  { icon: "✍️", text: "AI เขียน Caption ไม่จำกัด" },
  { icon: "📦", text: "บันทึกโปรเจกต์ทุกชิ้น" },
  { icon: "⚡", text: "ไม่มีโฆษณา ใช้ได้เลย" }
];

export function PaywallScreen({ navigation }: Props) {
  const { offering, purchasing, purchasePro, restorePurchases } = usePurchases();

  const proPackage = offering?.availablePackages[0];
  const priceText = proPackage?.product.priceString ?? "฿99/เดือน";

  const handlePurchase = useCallback(async () => {
    try {
      const success = await purchasePro();
      if (success) {
        Alert.alert("ยินดีด้วยครับ! 🎉", "อัพเกรดสำเร็จ ใช้งานได้ไม่จำกัดแล้ว", [
          { text: "เริ่มใช้งาน", onPress: () => navigation.goBack() }
        ]);
      }
    } catch {
      Alert.alert("ซื้อไม่สำเร็จ", "ลองใหม่อีกครั้งได้เลยครับ");
    }
  }, [purchasePro, navigation]);

  const handleRestore = useCallback(async () => {
    const restored = await restorePurchases();
    if (restored) {
      Alert.alert("พบการซื้อเดิม", "กู้คืน Pro สำเร็จแล้วครับ", [
        { text: "ตกลง", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("ไม่พบการซื้อ", "ยังไม่เคยซื้อ Pro ในบัญชีนี้ครับ");
    }
  }, [restorePurchases, navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#FFF8EE", "#FFF2E0"]} style={styles.hero}>
          <Text style={styles.badge}>Pro</Text>
          <Text style={styles.title}>แต่งรูปขายสินค้า{"\n"}ได้ไม่จำกัด</Text>
          <Text style={styles.subtitle}>ยกระดับร้านออนไลน์ ทำภาพโปรฉบับเต็ม</Text>
        </LinearGradient>

        <View style={styles.features}>
          {PRO_FEATURES.map((f) => (
            <View key={f.icon} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.pricing}>
          <View style={styles.pricingCard}>
            <Text style={styles.planLabel}>Pro</Text>
            <Text style={styles.price}>{priceText}</Text>
            <Text style={styles.priceSub}>ยกเลิกได้ทุกเมื่อ</Text>
          </View>
          <View style={styles.pricingCard}>
            <Text style={styles.planLabel}>Free</Text>
            <Text style={styles.price}>ฟรี</Text>
            <Text style={styles.priceSub}>5 รูป/วัน</Text>
          </View>
        </View>

        <View style={styles.actions}>
          {purchasing ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.loadingText}>กำลังดำเนินการ...</Text>
            </View>
          ) : (
            <>
              <ActionButton label={`อัพเกรด Pro — ${priceText}`} onPress={handlePurchase} />
              <ActionButton label="ใช้ Free ต่อไป" variant="secondary" onPress={() => navigation.goBack()} />
            </>
          )}
          <Pressable onPress={handleRestore} disabled={purchasing} style={styles.restore}>
            <Text style={styles.restoreText}>กู้คืนการซื้อเดิม</Text>
          </Pressable>
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
    gap: spacing.lg,
    paddingBottom: spacing.xl
  },
  hero: {
    padding: spacing.xl,
    gap: spacing.sm
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.primary,
    color: "#FFF",
    fontWeight: "800",
    fontSize: 13
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 40
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22
  },
  features: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  featureIcon: {
    fontSize: 22,
    width: 32
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "600"
  },
  pricing: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.xl
  },
  pricingCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card
  },
  planLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.muted
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text
  },
  priceSub: {
    fontSize: 12,
    color: colors.muted
  },
  actions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm
  },
  loadingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg
  },
  loadingText: {
    color: colors.muted,
    fontSize: 15
  },
  restore: {
    alignItems: "center",
    paddingVertical: spacing.sm
  },
  restoreText: {
    fontSize: 14,
    color: colors.muted
  }
});
