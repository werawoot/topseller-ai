import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { colors, radii, shadows, spacing } from "../constants/theme";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";
import type { Project } from "../services/projects";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Projects">;

export function ProjectsScreen({ navigation }: Props) {
  const { user } = useAuth();
  const { projects, loading, saving, remove, reload } = useProjects(user?.id);

  const handleDelete = useCallback(
    (project: Project) => {
      Alert.alert(
        "ลบโปรเจกต์?",
        `"${project.title}" จะถูกลบถาวรครับ`,
        [
          { text: "ยกเลิก", style: "cancel" },
          { text: "ลบ", style: "destructive", onPress: () => remove(project.id) }
        ]
      );
    },
    [remove]
  );

  const renderItem = useCallback(
    ({ item }: { item: Project }) => (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>🛍️</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.cardDate}>
              {new Date(item.created_at).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </Text>
            {item.caption ? (
              <Text style={styles.cardCaption} numberOfLines={2}>{item.caption}</Text>
            ) : null}
          </View>
        </View>
        <Pressable onPress={() => handleDelete(item)} hitSlop={8} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>ลบ</Text>
        </Pressable>
      </View>
    ),
    [handleDelete]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onRefresh={reload}
          refreshing={saving}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📂</Text>
              <Text style={styles.emptyTitle}>ยังไม่มีโปรเจกต์</Text>
              <Text style={styles.emptyText}>แต่งรูปสินค้าแล้วกดบันทึก จะมาโชว์ที่นี่ครับ</Text>
              <Pressable onPress={() => navigation.navigate("Editor")} style={styles.startBtn}>
                <Text style={styles.startBtnText}>เริ่มแต่งรูปสินค้า</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.page
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
    flexGrow: 1
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    ...shadows.card
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center"
  },
  cardIconText: {
    fontSize: 24
  },
  cardInfo: {
    flex: 1,
    gap: 2
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text
  },
  cardDate: {
    fontSize: 12,
    color: colors.muted
  },
  cardCaption: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
    marginTop: 2
  },
  deleteBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  deleteBtnText: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: 80
  },
  emptyIcon: {
    fontSize: 48
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text
  },
  emptyText: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22
  },
  startBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    marginTop: spacing.sm
  },
  startBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15
  }
});
