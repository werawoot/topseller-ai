import { useEffect, useState } from "react";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { removeBackground as removeBackgroundNative } from "@six33/react-native-bg-removal";

import type { BackgroundOption, EditorHookOptions, PromoTemplate } from "../types/app";
import { generateThaiCaption } from "../services/gemini";
import { configureRevenueCat } from "../services/revenueCat";

export const useEditor = ({ backgrounds, templates }: EditorHookOptions) => {
  const defaultBackground = backgrounds[0] as BackgroundOption;
  const defaultTemplate = templates[0] as PromoTemplate;

  const [originalImageUri, setOriginalImageUri] = useState<string | null>(null);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState(defaultBackground.id);
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplate.id);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [isRemovingBackground, setIsRemovingBackground] = useState(false);
  const [isCaptionLoading, setIsCaptionLoading] = useState(false);

  useEffect(() => {
    void configureRevenueCat();
  }, []);

  const selectedBackground: BackgroundOption =
    backgrounds.find((b) => b.id === selectedBackgroundId) ?? defaultBackground;
  const selectedTemplate: PromoTemplate =
    templates.find((t) => t.id === selectedTemplateId) ?? defaultTemplate;

  const pickImage = async (uri: string | null) => {
    if (!uri) return;
    setError("");
    setCaption("");
    setOriginalImageUri(uri);
    setPreviewImageUri(uri);
  };

  const removeBackground = async () => {
    if (!originalImageUri) return;
    try {
      setError("");
      setIsRemovingBackground(true);
      const cutoutUri = await removeBackgroundNative(originalImageUri, { trim: true });
      const normalized = await manipulateAsync(cutoutUri, [{ resize: { width: 1200 } }], {
        compress: 1,
        format: SaveFormat.PNG
      });
      setPreviewImageUri(normalized.uri);
    } catch {
      setError("ตัดพื้นหลังไม่สำเร็จบนเครื่องนี้ อาจเป็นเพราะรุ่น iOS/Android ยังไม่รองรับ");
    } finally {
      setIsRemovingBackground(false);
    }
  };

  const generateCaption = async () => {
    if (!previewImageUri) return;
    try {
      setError("");
      setIsCaptionLoading(true);
      const nextCaption = await generateThaiCaption(selectedTemplate);
      setCaption(nextCaption);
    } catch {
      setError("สร้าง caption ไม่สำเร็จ ลองเช็ก Gemini API key และอินเทอร์เน็ตอีกครั้งครับ");
    } finally {
      setIsCaptionLoading(false);
    }
  };

  const resetEditor = () => {
    if (!originalImageUri) return;
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
