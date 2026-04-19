const getEnv = (key: string) => process.env[key];

export const env = {
  supabaseUrl: getEnv("EXPO_PUBLIC_SUPABASE_URL") ?? "",
  supabaseAnonKey: getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY") ?? "",
  geminiApiKey: getEnv("EXPO_PUBLIC_GEMINI_API_KEY") ?? "",
  revenueCatAppleApiKey: getEnv("EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY") ?? "",
  revenueCatGoogleApiKey: getEnv("EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY") ?? "",
  lineShareUrl: getEnv("EXPO_PUBLIC_LINE_SHARE_URL") ?? "line://msg/text/",
  tikTokShareUrl: getEnv("EXPO_PUBLIC_TIKTOK_SHARE_URL") ?? "",
  shopeeShareUrl: getEnv("EXPO_PUBLIC_SHOPEE_SHARE_URL") ?? ""
};
