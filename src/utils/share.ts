import { Alert, Linking, Share } from "react-native";
import * as Sharing from "expo-sharing";

import { env } from "../config/env";

type ShareProjectParams = {
  imageUri: string;
  caption: string;
  platformName: string;
};

export const shareProject = async ({
  imageUri,
  caption,
  platformName
}: ShareProjectParams) => {
  const message = caption || "สร้างรูปขายของจาก TopSeller AI";

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(imageUri, {
      dialogTitle: platformName
    });
    return;
  }

  await Share.share({
    message,
    url: imageUri
  });
};

export const openPlatformShare = async (platform: "line" | "tiktok" | "shopee", caption: string) => {
  const urlMap = {
    line: `${env.lineShareUrl}${encodeURIComponent(caption)}`,
    tiktok: env.tikTokShareUrl,
    shopee: env.shopeeShareUrl
  };

  const targetUrl = urlMap[platform];
  if (!targetUrl) {
    Alert.alert("ยังไม่ได้ตั้งค่า", `ยังไม่ได้ตั้งค่าลิงก์แชร์ของ ${platform}`);
    return;
  }

  const canOpen = await Linking.canOpenURL(targetUrl);
  if (!canOpen) {
    Alert.alert("เปิดแอปไม่ได้", `ยังเปิด ${platform} จาก deep link นี้ไม่ได้`);
    return;
  }

  await Linking.openURL(targetUrl);
};
