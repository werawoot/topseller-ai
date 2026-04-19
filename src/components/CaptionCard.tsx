import Clipboard from "@react-native-clipboard/clipboard";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type CaptionCardProps = {
  caption: string;
};

export const CaptionCard = ({ caption }: CaptionCardProps) => {
  const onCopy = () => {
    if (!caption) {
      return;
    }

    Clipboard.setString(caption);
    Alert.alert("คัดลอกแล้ว", "นำ caption ไปวางต่อใน LINE, TikTok หรือ Shopee ได้เลย");
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Caption พร้อมใช้</Text>
        <Pressable onPress={onCopy} disabled={!caption}>
          <Text style={[styles.copy, !caption && styles.copyDisabled]}>คัดลอก</Text>
        </Pressable>
      </View>
      <Text style={styles.caption}>
        {caption || "กด AI เขียน Caption เพื่อให้ระบบสร้างข้อความขายของภาษาไทยให้ครับ"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text
  },
  copy: {
    color: colors.primary,
    fontWeight: "700"
  },
  copyDisabled: {
    opacity: 0.5
  },
  caption: {
    color: colors.text,
    lineHeight: 24,
    fontSize: 15
  }
});
