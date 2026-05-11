import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

import { supabase } from "./supabase";
import { withRetry } from "../utils/retry";

export type Project = {
  id: string;
  user_id: string;
  title: string;
  original_image_path: string | null;
  edited_image_path: string | null;
  template_id: string | null;
  background_id: string | null;
  caption: string | null;
  created_at: string;
  updated_at: string;
};

type SaveProjectParams = {
  userId: string;
  title?: string;
  originalImageUri?: string | null;
  editedImageUri?: string | null;
  templateId?: string;
  backgroundId?: string;
  caption?: string;
};

async function uploadImage(userId: string, localUri: string, filename: string): Promise<string> {
  if (!supabase) throw new Error("Supabase ยังไม่ได้ตั้งค่า");

  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: "base64"
  });

  const path = `${userId}/${filename}`;
  await withRetry(async () => {
    const { error } = await supabase!.storage
      .from("project-images")
      .upload(path, decode(base64), { contentType: "image/png", upsert: true });
    if (error) throw new Error(error.message);
  });

  return path;
}

export async function saveProject(params: SaveProjectParams): Promise<Project> {
  if (!supabase) throw new Error("Supabase ยังไม่ได้ตั้งค่า");

  const timestamp = Date.now();
  let originalPath: string | null = null;
  let editedPath: string | null = null;

  if (params.originalImageUri) {
    originalPath = await uploadImage(
      params.userId,
      params.originalImageUri,
      `original_${timestamp}.png`
    );
  }

  if (params.editedImageUri) {
    editedPath = await uploadImage(
      params.userId,
      params.editedImageUri,
      `edited_${timestamp}.png`
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: params.userId,
      title: params.title ?? `โปรเจกต์ ${new Date().toLocaleDateString("th-TH")}`,
      original_image_path: originalPath,
      edited_image_path: editedPath,
      template_id: params.templateId ?? null,
      background_id: params.backgroundId ?? null,
      caption: params.caption ?? null
    })
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function listProjects(userId: string): Promise<Project[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function deleteProject(projectId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) throw error;
}

export async function getImageUrl(path: string): Promise<string> {
  if (!supabase) throw new Error("Supabase ยังไม่ได้ตั้งค่า");

  const { data } = await supabase.storage
    .from("project-images")
    .createSignedUrl(path, 60 * 60); // 1 ชั่วโมง

  if (!data?.signedUrl) throw new Error("สร้าง URL ไม่สำเร็จ");
  return data.signedUrl;
}
