import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ActionButton } from "../components/ActionButton";
import { colors, radii, shadows, spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Auth">;
type Mode = "login" | "signup" | "reset";

export function AuthScreen({ navigation }: Props) {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithApple } = useAuth();

  const handleAppleSignIn = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL
        ]
      });
      if (!credential.identityToken) throw new Error("ไม่ได้รับ token จาก Apple");
      await signInWithApple(credential.identityToken);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("ERR_CANCELED")) return;
      Alert.alert("Sign in with Apple ไม่สำเร็จ", err instanceof Error ? err.message : "ลองใหม่อีกครั้งครับ");
    }
  }, [signInWithApple]);

  const handleSubmit = useCallback(async () => {
    if (!email.trim()) {
      Alert.alert("กรอกอีเมลก่อนครับ");
      return;
    }

    if (mode === "reset") {
      if (!supabase) {
        Alert.alert("ข้อผิดพลาด", "Supabase ยังไม่ได้ตั้งค่า");
        return;
      }
      setLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: "topsellerai://reset-password"
        });
        if (error) throw error;
        Alert.alert(
          "ส่งอีเมลแล้วครับ",
          "เช็กกล่องจดหมายเพื่อรีเซ็ตรหัสผ่าน",
          [{ text: "ตกลง", onPress: () => setMode("login") }]
        );
      } catch (err) {
        Alert.alert("ไม่สำเร็จ", err instanceof Error ? err.message : "ลองใหม่อีกครั้งครับ");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password.trim()) {
      Alert.alert("กรอกรหัสผ่านก่อนครับ");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(email.trim(), password);
        Alert.alert(
          "สมัครสำเร็จ! 🎉",
          "เช็กอีเมลเพื่อยืนยันบัญชีก่อนเข้าใช้งานครับ",
          [{ text: "ตกลง", onPress: () => setMode("login") }]
        );
      } else {
        await signIn(email.trim(), password);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "เกิดข้อผิดพลาด";
      Alert.alert("ไม่สำเร็จ", translateError(msg));
    } finally {
      setLoading(false);
    }
  }, [email, password, mode, signIn, signUp]);

  const titleMap: Record<Mode, string> = {
    signup: "สมัครใช้งาน",
    login: "เข้าสู่ระบบ",
    reset: "ลืมรหัสผ่าน"
  };

  const subtitleMap: Record<Mode, string> = {
    signup: "สร้างบัญชีฟรี ไม่ต้องใส่บัตรเครดิต",
    login: "ยินดีต้อนรับกลับมาครับ",
    reset: "ใส่อีเมลแล้วเราจะส่งลิงก์รีเซ็ตให้ครับ"
  };

  const buttonMap: Record<Mode, string> = {
    signup: "สมัครใช้งาน",
    login: "เข้าสู่ระบบ",
    reset: "ส่งลิงก์รีเซ็ต"
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.logo}>TopSeller AI</Text>
            <Text style={styles.title}>{titleMap[mode]}</Text>
            <Text style={styles.subtitle}>{subtitleMap[mode]}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>อีเมล</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor={colors.muted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
              />
            </View>

            {mode !== "reset" && (
              <View style={styles.field}>
                <Text style={styles.label}>รหัสผ่าน</Text>
                <TextInput
                  style={styles.input}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  placeholderTextColor={colors.muted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  editable={!loading}
                />
                {mode === "login" && (
                  <Pressable onPress={() => setMode("reset")} disabled={loading}>
                    <Text style={styles.forgotText}>ลืมรหัสผ่าน?</Text>
                  </Pressable>
                )}
              </View>
            )}

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>กำลังดำเนินการ...</Text>
              </View>
            ) : (
              <ActionButton label={buttonMap[mode]} onPress={handleSubmit} />
            )}
          </View>

          {mode !== "reset" && Platform.OS === "ios" && (
            <View style={styles.appleSection}>
              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>หรือ</Text>
                <View style={styles.divider} />
              </View>
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={14}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            </View>
          )}

          <View style={styles.footer}>
            {mode === "reset" ? (
              <Pressable onPress={() => setMode("login")} disabled={loading}>
                <Text style={styles.toggleText}>
                  <Text style={styles.toggleLink}>กลับไปเข้าสู่ระบบ</Text>
                </Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => setMode(mode === "login" ? "signup" : "login")} disabled={loading}>
                <Text style={styles.toggleText}>
                  {mode === "signup" ? "มีบัญชีแล้ว? " : "ยังไม่มีบัญชี? "}
                  <Text style={styles.toggleLink}>
                    {mode === "signup" ? "เข้าสู่ระบบ" : "สมัครฟรี"}
                  </Text>
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function translateError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "อีเมลหรือรหัสผ่านไม่ถูกต้องครับ";
  if (msg.includes("Email not confirmed")) return "กรุณายืนยันอีเมลก่อนเข้าใช้งานครับ";
  if (msg.includes("User already registered")) return "อีเมลนี้ถูกใช้งานแล้วครับ";
  if (msg.includes("Password should be")) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรครับ";
  return msg;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page
  },
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: "center",
    gap: spacing.xl
  },
  header: {
    gap: spacing.sm
  },
  logo: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.sm
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22
  },
  form: {
    gap: spacing.md
  },
  field: {
    gap: spacing.xs
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    ...shadows.card
  },
  forgotText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
    alignSelf: "flex-end"
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md
  },
  loadingText: {
    color: colors.muted,
    fontSize: 15
  },
  appleSection: {
    gap: spacing.md
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border
  },
  dividerText: {
    fontSize: 13,
    color: colors.muted
  },
  appleButton: {
    width: "100%",
    height: 50
  },
  footer: {
    alignItems: "center"
  },
  toggleText: {
    fontSize: 15,
    color: colors.muted
  },
  toggleLink: {
    color: colors.primary,
    fontWeight: "700"
  }
});
