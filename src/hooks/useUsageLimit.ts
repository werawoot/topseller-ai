import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { FREE_DAILY_LIMIT } from "../types/app";

const STORAGE_KEY = "usage_count";
const DATE_KEY = "usage_date";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function useUsageLimit(isPro: boolean) {
  const [usedToday, setUsedToday] = useState(0);

  useEffect(() => {
    const load = async () => {
      const [count, date] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(DATE_KEY)
      ]);
      if (date === todayString()) {
        setUsedToday(Number(count ?? 0));
      } else {
        await Promise.all([AsyncStorage.setItem(STORAGE_KEY, "0"), AsyncStorage.setItem(DATE_KEY, todayString())]);
        setUsedToday(0);
      }
    };
    load();
  }, []);

  const canUse = isPro || usedToday < FREE_DAILY_LIMIT;
  const remaining = isPro ? Infinity : Math.max(0, FREE_DAILY_LIMIT - usedToday);

  const recordUsage = useCallback(async () => {
    if (isPro) return;
    const next = usedToday + 1;
    setUsedToday(next);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEY, String(next)),
      AsyncStorage.setItem(DATE_KEY, todayString())
    ]);
  }, [isPro, usedToday]);

  return { canUse, remaining, usedToday, recordUsage };
}
