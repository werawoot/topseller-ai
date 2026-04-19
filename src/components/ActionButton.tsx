import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "../constants/theme";

type ActionButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export const ActionButton = ({
  label,
  onPress,
  disabled = false,
  variant = "primary"
}: ActionButtonProps) => (
  <Pressable
    disabled={disabled}
    onPress={onPress}
    style={[
      styles.base,
      variant === "primary" ? styles.primary : styles.secondary,
      disabled && styles.disabled
    ]}
  >
    <Text style={[styles.label, variant === "primary" ? styles.primaryLabel : styles.secondaryLabel]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  disabled: {
    opacity: 0.5
  },
  label: {
    fontSize: 16,
    fontWeight: "700"
  },
  primaryLabel: {
    color: "#FFFFFF"
  },
  secondaryLabel: {
    color: colors.text
  }
});
