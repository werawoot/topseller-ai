import "react-native-url-polyfill/auto";

import { useMemo, useRef } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { captureRef } from "react-native-view-shot";

import { ActionButton } from "./src/components/ActionButton";
import { CaptionCard } from "./src/components/CaptionCard";
import { EditorPreview } from "./src/components/EditorPreview";
import { FeatureChip } from "./src/components/FeatureChip";
import { colors, radii, shadows, spacing } from "./src/constants/theme";
import { useEditor } from "./src/hooks/useEditor";
import type { BackgroundOption, PromoTemplate } from "./src/types/app";
import { openPlatformShare, shareProject } from "./src/utils/share";

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

export default function App() {
  const previewRef = useRef<View>(null);
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
  } = useEditor({
    backgrounds: BACKGROUNDS,
    templates: TEMPLATES
  });

  const hasImage = Boolean(previewImageUri);

  const heroTitle = useMemo(
    () => "ถ่าย 1 รูป แล้วทำให้พร้อมขายในไม่กี่นาที",
    []
  );

  const openGallery = async () => {
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
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("ต้องขอสิทธิ์ก่อน", "อนุญาตให้ใช้กล้องเพื่อถ่ายรูปสินค้าครับ");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      await pickImage(result.assets[0]?.uri ?? null);
    }
  };

  const exportAndShare = async () => {
    if (!previewRef.current || !previewImageUri) {
      Alert.alert("ยังไม่มีรูป", "เลือกรูปสินค้าและตกแต่งก่อนแชร์ครับ");
      return;
    }

    try {
      const uri = await captureRef(previewRef, {
        format: "png",
        quality: 1,
        result: "tmpfile"
      });

      await shareProject({
        imageUri: uri,
        caption,
        platformName: "แชร์ออกจากแอป"
      });
    } catch (captureError) {
      Alert.alert("แชร์ไม่สำเร็จ", "ยัง export ภาพไม่สำเร็จ ลองอีกครั้งได้เลยครับ");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={["#FFF8EE", "#F5F8FF"]} style={styles.hero}>
          <Text style={styles.badge}>TopSeller AI</Text>
          <Text style={styles.heroTitle}>{heroTitle}</Text>
          <Text style={styles.heroText}>
            ตัดพื้นหลัง เปลี่ยนฉาก ใส่โปรโมชัน และเขียนแคปชั่นไทยให้พร้อมโพสต์ในแอปเดียว
          </Text>
          <View style={styles.heroActions}>
            <ActionButton label="เลือกรูปสินค้า" onPress={openGallery} />
            <ActionButton label="ถ่ายรูปใหม่" variant="secondary" onPress={openCamera} />
          </View>
          <View style={styles.chips}>
            <FeatureChip label="ตัดพื้นหลังอัตโนมัติ" />
            <FeatureChip label="Template โปรไทย" />
            <FeatureChip label="AI เขียน Caption ไทย" />
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ภาพตัวอย่างสินค้า</Text>
          <Text style={styles.sectionText}>
            โฟลว์นี้ทำไว้สำหรับแม่ค้า: เลือกรูปสินค้า แล้วแต่งให้พร้อมขายได้ในหน้าจอเดียว
          </Text>
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
            {BACKGROUNDS.map((background) => (
              <Pressable
                key={background.id}
                onPress={() => setBackground(background.id)}
                style={[
                  styles.selectionPill,
                  background.id === selectedBackground.id && styles.selectionPillActive
                ]}
              >
                <View style={[styles.swatch, { backgroundColor: background.fill }]} />
                <Text
                  style={[
                    styles.selectionPillText,
                    background.id === selectedBackground.id && styles.selectionPillTextActive
                  ]}
                >
                  {background.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. ใส่ Template โปรโมชันไทย</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            {TEMPLATES.map((template) => (
              <Pressable
                key={template.id}
                onPress={() => setTemplate(template.id)}
                style={[
                  styles.templateCard,
                  template.id === selectedTemplate.id && styles.templateCardActive
                ]}
              >
                <Text style={styles.templateCardTitle}>{template.title}</Text>
                <Text style={styles.templateCardSub}>{template.subtitle}</Text>
                <Text style={styles.templateCardDiscount}>{template.discount}</Text>
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
          </View>
          <CaptionCard caption={caption} />
          <View style={styles.shareTargets}>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>พร้อมต่อยอดเป็นแอปจริง</Text>
          <Text style={styles.sectionText}>
            โครงนี้เตรียมจุดเชื่อมไว้แล้วสำหรับ Supabase, RevenueCat และ Gemini API เพื่อไปต่อเป็น MVP บน
            App Store ได้เลย
          </Text>
          <View style={styles.integrations}>
            <View style={styles.integrationItem}>
              <Text style={styles.integrationTitle}>Supabase</Text>
              <Text style={styles.integrationText}>เก็บผู้ใช้, โปรเจกต์, usage limit และ subscription state</Text>
            </View>
            <View style={styles.integrationItem}>
              <Text style={styles.integrationTitle}>RevenueCat</Text>
              <Text style={styles.integrationText}>รองรับ Free / Basic / Pro และ sync entitlement ข้ามแพลตฟอร์ม</Text>
            </View>
            <View style={styles.integrationItem}>
              <Text style={styles.integrationTitle}>Gemini API</Text>
              <Text style={styles.integrationText}>เขียน caption ภาษาไทยจากรูป + โปรโมชันที่เลือก</Text>
            </View>
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.page
  },
  container: {
    padding: spacing.lg,
    gap: spacing.lg
  },
  hero: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.card
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.surface,
    color: colors.text,
    fontWeight: "700"
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 38,
    color: colors.text,
    fontWeight: "800"
  },
  heroText: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24
  },
  heroActions: {
    gap: spacing.sm
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
    fontSize: 22,
    color: colors.text,
    fontWeight: "800"
  },
  sectionText: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22
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
  actionGrid: {
    gap: spacing.sm
  },
  shareTargets: {
    gap: spacing.sm
  },
  pillRow: {
    gap: spacing.sm,
    paddingRight: spacing.md
  },
  selectionPill: {
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
  selectionPillActive: {
    borderColor: colors.primary,
    backgroundColor: "#FFF1E5"
  },
  selectionPillText: {
    color: colors.text,
    fontWeight: "600"
  },
  selectionPillTextActive: {
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
  templateCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text
  },
  templateCardSub: {
    fontSize: 13,
    color: colors.muted
  },
  templateCardDiscount: {
    marginTop: spacing.xs,
    fontSize: 18,
    color: colors.primary,
    fontWeight: "800"
  },
  integrations: {
    gap: spacing.sm
  },
  integrationItem: {
    padding: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  integrationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text
  },
  integrationText: {
    marginTop: spacing.xs,
    color: colors.muted,
    lineHeight: 22
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
  }
});
