import { useCallback, useEffect, useState } from "react";

import { deleteProject, listProjects, saveProject, type Project } from "../services/projects";

type State = {
  projects: Project[];
  loading: boolean;
  saving: boolean;
  error: string | null;
};

export function useProjects(userId: string | undefined) {
  const [state, setState] = useState<State>({
    projects: [],
    loading: false,
    saving: false,
    error: null
  });

  const load = useCallback(async () => {
    if (!userId) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await listProjects(userId);
      setState((s) => ({ ...s, projects: data, loading: false }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "โหลดโปรเจกต์ไม่สำเร็จ";
      setState((s) => ({ ...s, loading: false, error: msg }));
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (params: Omit<Parameters<typeof saveProject>[0], "userId">): Promise<Project | null> => {
      if (!userId) return null;
      setState((s) => ({ ...s, saving: true, error: null }));
      try {
        const project = await saveProject({ ...params, userId });
        setState((s) => ({
          ...s,
          saving: false,
          projects: [project, ...s.projects]
        }));
        return project;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "บันทึกไม่สำเร็จ";
        setState((s) => ({ ...s, saving: false, error: msg }));
        return null;
      }
    },
    [userId]
  );

  const remove = useCallback(
    async (projectId: string) => {
      try {
        await deleteProject(projectId);
        setState((s) => ({
          ...s,
          projects: s.projects.filter((p) => p.id !== projectId)
        }));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "ลบไม่สำเร็จ";
        setState((s) => ({ ...s, error: msg }));
      }
    },
    []
  );

  return { ...state, save, remove, reload: load };
}
