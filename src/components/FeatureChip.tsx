import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

export const FeatureChip = ({ label }: { label: string }) => (
  <View style={styles.chip}>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#FFFFFFCC",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999
  },
  label: {
    color: colors.text,
    fontWeight: "600"
  }
});
