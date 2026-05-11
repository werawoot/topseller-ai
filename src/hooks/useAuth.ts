import { useCallback, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "../services/supabase";
import { clearUserContext, setUserContext } from "../services/sentry";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    if (!supabase) {
      setState({ user: null, session: null, loading: false });
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user ?? null;
      if (user) setUserContext(user.id, user.email ?? "");
      setState({ user, session: data.session, loading: false });
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      if (user) setUserContext(user.id, user.email ?? "");
      else clearUserContext();
      setState({ user, session, loading: false });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signInWithApple = useCallback(async (identityToken: string) => {
    if (!supabase) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: identityToken
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return { ...state, signUp, signIn, signInWithApple, signOut };
}
