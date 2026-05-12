import { act, renderHook } from "@testing-library/react-native";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

import { useUsageLimit } from "../hooks/useUsageLimit";

describe("useUsageLimit", () => {
  it("Pro user can always use", async () => {
    const { result } = renderHook(() => useUsageLimit(true));
    await act(async () => {});
    expect(result.current.canUse).toBe(true);
    expect(result.current.remaining).toBe(Infinity);
  });

  it("Free user starts with full quota", async () => {
    const { result } = renderHook(() => useUsageLimit(false));
    await act(async () => {});
    expect(result.current.canUse).toBe(true);
    expect(result.current.remaining).toBe(5);
  });

  it("Free user quota decreases after recordUsage", async () => {
    const { result } = renderHook(() => useUsageLimit(false));
    await act(async () => {});
    await act(async () => { await result.current.recordUsage(); });
    expect(result.current.remaining).toBe(4);
  });
});
