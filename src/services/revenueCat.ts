import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

import { env } from "../config/env";

let configured = false;

export const configureRevenueCat = async () => {
  if (configured) {
    return;
  }

  const apiKey =
    Platform.OS === "ios" ? env.revenueCatAppleApiKey : env.revenueCatGoogleApiKey;

  if (!apiKey) {
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.WARN);
  await Purchases.configure({ apiKey });
  configured = true;
};

export const getIsProUser = async () => {
  const customerInfo = await Purchases.getCustomerInfo();
  return Boolean(customerInfo.entitlements.active.pro);
};
