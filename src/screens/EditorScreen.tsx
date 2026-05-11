import { useRef } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { captureRef } from "react-native-view-shot";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ActionButton } from "../components/ActionButton";
import { CaptionCard } from "../components/CaptionCard";
import { EditorPreview } from "../components/EditorPreview";
import { colors, radii, shadows, spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { useEditor } from "../hooks/useEditor";
import { useProjects } from "../hooks/useProjects";
import { usePurchases } from "../hooks/usePurchases";
import { useUsageLimit } from "../hooks/useUsageLimit";
import type { RootStackParamList } from "../navigation/types";
import type { BackgroundOption, PromoTemplate } from "../types/app";
import { openPlatformShare, shareProject } from "../utils/share";

type Props = NativeStackScreenProps<RootStackParamList, "Editor">;

const BACKGROUNDS: BackgroundOption[] = [
  { id: "white", label: "พื้นขาว", fill: "#FFFFFF", accent: "#E5E7EB" },
  { id: "peach", label: "พีชพาสเทล", fill: "#FFF2EC", accent: "#FDBA8C" },
  { id: "mint", label: "เขียวพาสเทล", fill: "#ECFDF5", accent: "#6EE7B7" },
  { id: "sky", label: "ฟ้าพาสเทล", fill: "#EFF6FF", accent: "#93C5FD" }
];

const TEMPLATES: PromoTemplate[] = [
  { id: "flash-sale", title: "Flash Sale", subtitle: "วันนี้เท่านั้น", discount: "ลด 30%" },
  { id: "best-seller", title: "ขายดี", subtitle: "พร้อมส่ง", discount: "ยอดฮิต" },
  { id: "mega-sale", title: "Mega Sale", subtitle: "โปรแรงส่งฟรี", discount: "ลด 50%" }
];

export function EditorScreen({ navigation }: Props) {
  const previewRef = useRef<View>(null);
  const { user } = useAuth();
  const { isPro } = usePurchases();
  const { canUse, remaining, recordUsage } = useUsageLimit(isPro);
  const { save, saving } = useProjects(user?.id);

  const goToPaywall = () => navigation.navigate("Paywall");

  const {
    caption,
    error,
    isBusy,
    isCaptionLoading,
    isRemovingBackground,
    originalImageUri,
    previewImageUri,
    selectedBackground,
    selectedTemplate,
    pickImage,
    removeBackground,
    setBackground,
    setTemplate,
    generateCaption,
    resetEditor
  } = useEditor({ backgrounds: BACKGROUNDS, templates: TEMPLATES });

  const hasImage = Boolean(previewImageUri);

  const openGallery = async () => {
    if (!canUse) {
      Alert.alert(
        "ใช้ครบ 5 รูปแล้วครับ",
        "อัพเกรด Pro เพื่อแต่งรูปได้ไม่จำกัด",
        [{ text: "ดู Pro", onPress: goToPaywall }, { text: "ยกเลิก", style: "cancel" }]
      );
      return;
    }
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("ต้องขอสิทธิ์ก่อน", "อนุญาตให้เข้าถึงรูปภาพเพื่อเริ่มแต่งสินค้าครับ");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });
    if (!result.canceled) {
      await pickImage(result.assets[0]?.uri ?? null);
      await recordUsage();
    }
  };

  const openCamera = async () => {
    if (!canUse) {
      Alert.alert(
        "ใช้ครบ 5 รูปแล้วครับ",
        "อัพเกรด Pro เพื่อแต่งรูปได้ไม่จำกัด",
        [{ text: "ดู Pro", onPress: goToPaywall }, { text: "ยกเลิก", style: "cancel" }]
      );
      return;
    }
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("ต้องขอสิทธิ์ก่อน", "อนุญาตให้ใช้กล้องเพื่อถ่ายรูปสินค้าครับ");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled) {
      await pickImage(result.assets[0]?.uri ?? null);
      await recordUsage();
    }
  };

  const saveToHistory = async () => {
    if (!previewImageUri) {
      Alert.alert("ยังไม่มีรูป", "แต่งรูปก่อนแล้วค่อยบันทึกครับ");
      return;
    }
    const project = await save({
      originalImageUri: originalImageUri ?? undefined,
      editedImageUri: previewImageUri,
      templateId: selectedTemplate.id,
      backgroundId: selectedBackground.id,
      caption: caption ?? undefined
    });
    if (project) Alert.alert("บันทึกแล้วครับ ✅", "ดูได้ที่โปรเจกต์ของฉัน");
  };

  const exportAndShare = async () => {
    if (!previewRef.current || !previewImageUri) {
      Alert.alert("ยังไม่มีรูป", "เลือกรูปสินค้าและตกแต่งก่อนแชร์ครับ");
      return;
    }
    try {
      const uri = await captureRef(previewRef, { format: "png", quality: 1, result: "tmpfile" });
      await shareProject({ imageUri: uri, caption, platformName: "แชร์ออกจากแอป" });
    } catch {
      Alert.alert("แชร์ไม่สำเร็จ", "ยัง export ภาพไม่สำเร็จ ลองอีกครั้งได้เลยครับ");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!isPro && (
          <Pressable onPress={goToPaywall} style={styles.usageBanner}>
            <Text style={styles.usageBannerText}>
              {canUse ? `เหลือ ${remaining}/${5} รูปวันนี้ · อัพ Pro ไม่จำกัด` : "ใช้ครบแล้ววันนี้ · แตะเพื่ออัพ Pro"}
            </Text>
          </Pressable>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ภาพสินค้า</Text>
          <View style={styles.actionGrid}>
            <ActionButton label="เลือกรูปสินค้า" onPress={openGallery} />
            <ActionButton label="ถ่ายรูปใหม่" variant="secondary" onPress={openCamera} />
          </View>
          <EditorPreview
            ref={previewRef}
            imageUri={previewImageUri}
            background={selectedBackground}
            template={selectedTemplate}
          />
          {!hasImage && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>ยังไม่มีรูปสินค้า</Text>
              <Text style={styles.emptyText}>เริ่มจากเลือกรูปหรือถ่ายใหม่ แล้วระบบจะพาไปต่อเอง</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. ปรับภาพสินค้า</Text>
          <View style={styles.actionGrid}>
            <ActionButton
              label={isRemovingBackground ? "กำลังตัดพื้นหลัง..." : "ตัดพื้นหลัง AI"}
              onPress={removeBackground}
              disabled={!originalImageUri || isBusy}
            />
            <ActionButton
              label="รีเซ็ตภาพ"
              variant="secondary"
              onPress={resetEditor}
              disabled={!originalImageUri || isBusy}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {BACKGROUNDS.map((bg) => (
              <Pressable
                key={bg.id}
                onPress={() => setBackground(bg.id)}
                style={[styles.pill, bg.id === selectedBackground.id && styles.pillActive]}
              >
                <View style={[styles.swatch, { backgroundColor: bg.fill }]} />
                <Text style={[styles.pillText, bg.id === selectedBackground.id && styles.pillTextActive]}>
                  {bg.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. ใส่ Template โปรโมชันไทย</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {TEMPLATES.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => setTemplate(t.id)}
                style={[styles.templateCard, t.id === selectedTemplate.id && styles.templateCardActive]}
              >
                <Text style={styles.templateTitle}>{t.title}</Text>
                <Text style={styles.templateSub}>{t.subtitle}</Text>
                <Text style={styles.templateDiscount}>{t.discount}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. สร้างแคปชั่นภาษาไทย</Text>
          <View style={styles.actionGrid}>
            <ActionButton
              label={isCaptionLoading ? "กำลังเขียน Caption..." : "AI เขียน Caption"}
              onPress={generateCaption}
              disabled={!previewImageUri || isBusy}
            />
            <ActionButton
              label="แชร์รูปพร้อมแคปชั่น"
              variant="secondary"
              onPress={exportAndShare}
              disabled={!previewImageUri}
            />
            <ActionButton
              label={saving ? "กำลังบันทึก..." : "บันทึกโปรเจกต์"}
              variant="secondary"
              onPress={saveToHistory}
              disabled={!previewImageUri || saving}
            />
          </View>
          <CaptionCard caption={caption} />
          <View style={styles.actionGrid}>
            <ActionButton
              label="ส่งเข้า LINE"
              variant="secondary"
              onPress={() => openPlatformShare("line", caption)}
              disabled={!caption}
            />
            <ActionButton
              label="เปิด TikTok"
              variant="secondary"
              onPress={() => openPlatformShare("tiktok", caption)}
              disabled={!caption}
            />
            <ActionButton
              label="เปิด Shopee"
              variant="secondary"
              onPress={() => openPlatformShare("shopee", caption)}
              disabled={!caption}
            />
          </View>
        </View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>มีบางอย่างต้องเช็กเพิ่ม</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
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
  section: {
    gap: spacing.md
  },
  sectionTitle: {
    fontSize: 22,
    color: colors.text,
    fontWeight: "800"
  },
  actionGrid: {
    gap: spacing.sm
  },
  emptyCard: {
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text
  },
  emptyText: {
    marginTop: spacing.xs,
    color: colors.muted,
    lineHeight: 22
  },
  pillRow: {
    gap: spacing.sm,
    paddingRight: spacing.md
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  pillActive: {
    borderColor: colors.primary,
    backgroundColor: "#FFF1E5"
  },
  pillText: {
    color: colors.text,
    fontWeight: "600"
  },
  pillTextActive: {
    color: colors.primary
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border
  },
  templateCard: {
    width: 150,
    borderRadius: radii.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs
  },
  templateCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#FFF4EB"
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text
  },
  templateSub: {
    fontSize: 13,
    color: colors.muted
  },
  templateDiscount: {
    marginTop: spacing.xs,
    fontSize: 18,
    color: colors.primary,
    fontWeight: "800"
  },
  errorCard: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FBCFE8"
  },
  errorTitle: {
    color: "#9F1239",
    fontWeight: "800",
    fontSize: 16
  },
  errorText: {
    marginTop: spacing.xs,
    color: "#9F1239",
    lineHeight: 22
  },
  usageBanner: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: "#FFF4EB",
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center"
  },
  usageBannerText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary
  }
});
