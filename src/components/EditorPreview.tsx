import { forwardRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";
import type { BackgroundOption, PromoTemplate } from "../types/app";
import { PromoTemplateCanvas } from "./PromoTemplateCanvas";

type EditorPreviewProps = {
  imageUri: string | null;
  background: BackgroundOption;
  template: PromoTemplate;
};

export const EditorPreview = forwardRef<View, EditorPreviewProps>(
  ({ imageUri, background, template }, ref) => (
    <View ref={ref} collapsable={false} style={[styles.card, { backgroundColor: background.fill }]}>
      <View style={[styles.glow, { backgroundColor: background.accent }]} />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>ภาพสินค้าจะแสดงตรงนี้</Text>
          <Text style={styles.placeholderText}>เลือกจากกล้องหรือแกลเลอรี แล้วระบบจะทำ preview ให้ทันที</Text>
        </View>
      )}
      <View style={styles.canvasWrap}>
        <PromoTemplateCanvas template={template} />
      </View>
    </View>
  )
);

const styles = StyleSheet.create({
  card: {
    minHeight: 420,
    borderRadius: radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg
  },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    opacity: 0.22,
    top: 74
  },
  image: {
    width: "100%",
    height: 260
  },
  placeholder: {
    alignItems: "center",
    gap: spacing.xs
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text
  },
  placeholderText: {
    maxWidth: 260,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22
  },
  canvasWrap: {
    position: "absolute",
    top: 18,
    left: 18
  }
});
