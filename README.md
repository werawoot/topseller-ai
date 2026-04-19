# TopSeller AI

React Native + Expo MVP สำหรับแม่ค้าออนไลน์ไทย: ตัดพื้นหลังสินค้า, เปลี่ยนฉาก, ใส่โปรโมชันไทย, เขียนแคปชั่นไทย และแชร์ภาพพร้อมขายได้เร็วขึ้น

## Stack

- React Native + Expo
- TypeScript
- `@six33/react-native-bg-removal`
- `expo-image-manipulator`
- `@shopify/react-native-skia`
- Gemini API
- Supabase
- RevenueCat

## เริ่มต้นใช้งาน

1. ติดตั้งแพ็กเกจ

```bash
npm install
```

2. สร้างไฟล์ environment

```bash
cp .env.example .env
```

3. ใส่ค่าเหล่านี้ใน `.env`

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_GEMINI_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`
- `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`

4. รันแอป

```bash
npm run start
```

## ฟีเจอร์ที่มีในโค้ดตอนนี้

- เลือกรูปจาก Gallery หรือ Camera
- ตัดพื้นหลังสินค้าอัตโนมัติ
- เปลี่ยนพื้นหลังเป็นขาวหรือพาสเทล
- ใส่แถบโปรโมชันไทยด้วย Skia
- เขียน caption ภาษาไทยด้วย Gemini
- แคปเจอร์ preview แล้วแชร์ผ่าน share sheet

## สิ่งที่ควรทำต่อ

- เชื่อม Supabase auth + ตาราง usage limits
- เก็บโปรเจกต์ภาพและ caption ลง database/storage
- ทำ paywall Free / Basic / Pro ด้วย RevenueCat offerings
- เพิ่ม deep link จริงสำหรับ LINE / TikTok / Shopee ตาม workflow ที่จะใช้
- เพิ่ม onboarding และ analytics สำหรับ App Store launch

## หมายเหตุ integration

- RevenueCat ใช้งานจริงต้องใช้ Expo development build ตามเอกสารของ RevenueCat
- `@six33/react-native-bg-removal` บนอุปกรณ์บางรุ่นอาจต้อง fallback ถ้า native model ไม่รองรับ
- Gemini API ในโค้ดนี้ใช้ endpoint `generateContent` โดยส่ง API key ผ่าน header `x-goog-api-key`
