import { useEffect, useState } from "react";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { removeBackground as removeBackgroundNative } from "@six33/react-native-bg-removal";

import type { EditorHookOptions } from "../types/app";
import { generateThaiCaption } from "../services/gemini";
import { configureRevenueCat } from "../services/revenueCat";

export const useEditor = ({ backgrounds, templates }: EditorHookOptions) => {
  const [originalImageUri, setOriginalImageUri] = useState<string | null>(null);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(backgrounds[0]?.id ?? "");
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? "");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);

  useEffect(() => {
    void configureRevenueCat();
  }, []);

  const selectedBackground =
    backgrounds.find((background) => background.id === selectedBackgroundId) ?? backgrounds[0];
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? templates[0];

  const pickImage = async (uri: string | null) => {
    if (!uri) {
      return;
    }

    setError("");
    setCaption("");
    setOriginalImageUri(uri);
    setPreviewImageUri(uri);
  };

  const removeBackground = async () => {
    if (!originalImageUri) {
      return;
    }

    try {
      setError("");
      setIsRemovingBackground(true);
      const cutoutUri = await removeBackgroundNative(originalImageUri, { trim: true });
      const normalized = await manipulateAsync(cutoutUri, [{ resize: { width: 1200 } }], {
        compress: 1,
        format: SaveFormat.PNG
      });
      setPreviewImageUri(normalized.uri);
    } catch (removeError) {
      setError(
        "ตัดพื้นหลังไม่สำเร็จบนเครื่องนี้ อาจเป็นเพราะรุ่น iOS/Android ยังไม่รองรับ native removal หรือยังต้องตั้งค่า API fallback เพิ่ม"
      );
    } finally {
      setIsRemovingBackground(false);
    }
  };

  const generateCaption = async () => {
    if (!previewImageUri) {
      return;
    }

    try {
      setError("");
      setIsCaptionLoading(true);
      const nextCaption = await generateThaiCaption(selectedTemplate);
      setCaption(nextCaption);
    } catch (captionError) {
      setError("สร้าง caption ไม่สำเร็จ ลองเช็ก Gemini API key และอินเทอร์เน็ตอีกครั้งครับ");
    } finally {
      setIsCaptionLoading(false);
    }
  };

  const resetEditor = () => {
    if (!originalImageUri) {
      return;
    }

    setPreviewImageUri(originalImageUri);
    setCaption("");
    setError("");
  };

  return {
    caption,
    error,
    originalImageUri,
    previewImageUri,
    selectedBackground,
    selectedTemplate,
    isRemovingBackground,
    isCaptionLoading,
    isBusy: isRemovingBackground || isCaptionLoading,
    pickImage,
    removeBackground,
    setBackground: setSelectedBackgroundId,
    setTemplate: setSelectedTemplateId,
    generateCaption,
    resetEditor
  };
};
