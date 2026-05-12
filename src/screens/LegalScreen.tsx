import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { colors, spacing } from "../constants/theme";
import type { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Legal">;

const PRIVACY_POLICY = `นโยบายความเป็นส่วนตัว — TopSeller AI
อัปเดตล่าสุด: 11 พฤษภาคม 2568

1. ข้อมูลที่เก็บรวบรวม
เราเก็บรวบรวมข้อมูลที่จำเป็นสำหรับการให้บริการ ได้แก่:
• อีเมลและข้อมูลบัญชีผู้ใช้
• รูปภาพสินค้าที่ผู้ใช้อัปโหลด (เก็บใน Supabase Storage ของผู้ใช้เอง)
• ข้อมูลการใช้งานแอป (ผ่าน Sentry และ RevenueCat)

2. การใช้ข้อมูล
ข้อมูลถูกใช้เพื่อ:
• ให้บริการตัดพื้นหลัง สร้าง caption และบันทึกโปรเจกต์
• ปรับปรุงประสบการณ์ใช้งาน
• ตรวจสอบสถานะ subscription

3. การแชร์ข้อมูล
เราไม่ขายข้อมูลส่วนตัวให้บุคคลที่สาม ข้อมูลจะถูกส่งให้บริการภายนอกเฉพาะที่จำเป็น:
• Supabase (database และ storage)
• RevenueCat (subscription management)
• Sentry (crash reporting — ไม่มีข้อมูลส่วนตัว)
• Google Gemini API (สร้าง caption — ไม่มีรูปภาพ)

4. สิทธิ์ของผู้ใช้
ผู้ใช้สามารถ:
• ขอดู แก้ไข หรือลบข้อมูลได้ทุกเมื่อ
• ลบบัญชีพร้อมข้อมูลทั้งหมดได้จากการตั้งค่า

5. ติดต่อ
หากมีข้อสงสัย ติดต่อได้ที่: topkung72@gmail.com`;

const TERMS_OF_SERVICE = `ข้อกำหนดการใช้งาน — TopSeller AI
อัปเดตล่าสุด: 11 พฤษภาคม 2568

1. การยอมรับข้อกำหนด
การใช้งานแอป TopSeller AI ถือว่าผู้ใช้ยอมรับข้อกำหนดเหล่านี้

2. บริการที่ให้
• ตัดพื้นหลังรูปสินค้าอัตโนมัติ
• สร้าง caption ภาษาไทยด้วย AI
• บันทึกและจัดการโปรเจกต์รูปภาพ

3. แพ็กเกจและการชำระเงิน
• Free: 5 รูป/วัน ไม่มีค่าใช้จ่าย
• Pro: ไม่จำกัด ชำระรายเดือน ยกเลิกได้ทุกเมื่อ
• การคืนเงินเป็นไปตามนโยบาย App Store / Google Play

4. ทรัพย์สินทางปัญญา
• รูปภาพที่ผู้ใช้อัปโหลดยังคงเป็นกรรมสิทธิ์ของผู้ใช้
• ผู้ใช้รับผิดชอบต่อเนื้อหาที่อัปโหลด

5. ข้อจำกัดความรับผิด
แอปให้บริการ "ตามสภาพ" ไม่รับประกันว่าจะทำงานได้อย่างต่อเนื่องหรือปราศจากข้อผิดพลาด

6. ติดต่อ
topkung72@gmail.com`;

export function LegalScreen({ route }: Props) {
  const isPrivacy = route.params.type === "privacy";
  const content = isPrivacy ? PRIVACY_POLICY : TERMS_OF_SERVICE;

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.body}>{content}</Text>
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
    padding: spacing.lg
  },
  content: {
    gap: spacing.md
  },
  body: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 24
  }
});
