import type { PromoTemplate } from "../types/app";
import { env } from "../config/env";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export const generateThaiCaption = async (template: PromoTemplate) => {
  if (!env.geminiApiKey) {
    return [
      `${template.title} ${template.discount} พร้อมส่ง เน้นภาพสวย ดูแพง แต่ลงขายได้ไว`,
      "สินค้าพร้อมส่ง คุณภาพดี ใช้งานง่าย ถ่ายรูปครั้งเดียวก็ทำภาพโปรได้เลย",
      "#พร้อมส่ง #โปรวันนี้ #แม่ค้าออนไลน์ #TikTokShop #Shopee"
    ].join("\n");
  }

  const prompt = [
    "คุณคือผู้ช่วยการตลาดสำหรับแม่ค้าออนไลน์ไทย",
    "เขียน caption ภาษาไทยสำหรับขายสินค้าออนไลน์",
    `สไตล์โปรโมชัน: ${template.title}`,
    `คำโปรโมชันหลัก: ${template.discount}`,
    `คำรอง: ${template.subtitle}`,
    "ข้อกำหนด:",
    "- ใช้ภาษาไทยล้วน อ่านง่าย",
    "- ไม่เกิน 4 บรรทัด",
    "- มี call to action",
    "- ปิดท้ายด้วย hashtag ไทย/อีคอมเมิร์ซ 3-5 อัน"
  ].join("\n");

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": env.geminiApiKey
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Gemini API request failed");
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini API returned no caption");
  }

  return text.trim();
};
