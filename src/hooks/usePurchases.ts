import { useCallback, useEffect, useState } from "react";
import Purchases, { type CustomerInfo, type PurchasesOffering } from "react-native-purchases";

import { configureRevenueCat } from "../services/revenueCat";

type PurchasesState = {
  isPro: boolean;
  offering: PurchasesOffering | null;
  loading: boolean;
  purchasing: boolean;
};

export function usePurchases() {
  const [state, setState] = useState<PurchasesState>({
    isPro: false,
    offering: null,
    loading: true,
    purchasing: false
  });

  const syncCustomerInfo = useCallback((info: CustomerInfo) => {
    setState((s) => ({ ...s, isPro: Boolean(info.entitlements.active.pro) }));
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await configureRevenueCat();
        const [info, offerings] = await Promise.all([
          Purchases.getCustomerInfo(),
          Purchases.getOfferings()
        ]);
        if (!mounted) return;
        setState({
          isPro: Boolean(info.entitlements.active.pro),
          offering: offerings.current,
          loading: false,
          purchasing: false
        });
      } catch {
        if (mounted) setState((s) => ({ ...s, loading: false }));
      }
    };

    init();
    Purchases.addCustomerInfoUpdateListener(syncCustomerInfo);

    return () => {
      mounted = false;
      Purchases.removeCustomerInfoUpdateListener(syncCustomerInfo);
    };
  }, [syncCustomerInfo]);

  const purchasePro = useCallback(async (): Promise<boolean> => {
    setState((s) => ({ ...s, purchasing: true }));
    try {
      const pkg = state.offering?.availablePackages[0];
      if (!pkg) throw new Error("ไม่พบแพ็กเกจ");
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const isPro = Boolean(customerInfo.entitlements.active.pro);
      setState((s) => ({ ...s, isPro, purchasing: false }));
      return isPro;
    } catch (err: unknown) {
      setState((s) => ({ ...s, purchasing: false }));
      // user cancelled — ไม่ throw
      if (err instanceof Error && err.message.includes("cancel")) return false;
      throw err;
    }
  }, [state.offering]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    setState((s) => ({ ...s, purchasing: true }));
    try {
      const info = await Purchases.restorePurchases();
      const isPro = Boolean(info.entitlements.active.pro);
      setState((s) => ({ ...s, isPro, purchasing: false }));
      return isPro;
    } catch {
      setState((s) => ({ ...s, purchasing: false }));
      return false;
    }
  }, []);

  return { ...state, purchasePro, restorePurchases };
}
