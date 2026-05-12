import { Component, type ReactNode } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../constants/theme";
import { captureError } from "../services/sentry";

type Props = { children: ReactNode; fallbackTitle?: string };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    captureError(error, { boundary: this.props.fallbackTitle });
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>
              {this.props.fallbackTitle ?? "เกิดข้อผิดพลาด"}
            </Text>
            <Text style={styles.message}>{this.state.error.message}</Text>
            <Pressable onPress={this.reset} style={styles.button}>
              <Text style={styles.buttonText}>ลองใหม่อีกครั้ง</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.lg
  },
  icon: {
    fontSize: 48
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center"
  },
  message: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22
  },
  button: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.md
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16
  }
});
