import * as Sentry from "@sentry/react-native";

export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.EXPO_PUBLIC_ENV ?? "development",
    debug: false,
    tracesSampleRate: 0.2,
    beforeSend(event) {
      // ไม่ส่ง error ที่ user cancel เอง
      if (event.exception?.values?.[0]?.value?.includes("cancel")) return null;
      return event;
    }
  });
}

export function captureError(err: unknown, context?: Record<string, unknown>) {
  if (err instanceof Error) {
    Sentry.captureException(err, { extra: context });
  } else {
    Sentry.captureMessage(String(err), { extra: context });
  }
}

export function setUserContext(userId: string, email: string) {
  Sentry.setUser({ id: userId, email });
}

export function clearUserContext() {
  Sentry.setUser(null);
}
