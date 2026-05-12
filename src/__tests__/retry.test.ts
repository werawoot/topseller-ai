import { withRetry } from "../utils/retry";

describe("withRetry", () => {
  it("resolves immediately on success", async () => {
    const fn = jest.fn().mockResolvedValue("ok");
    const result = await withRetry(fn);
    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on network error and eventually resolves", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error("network timeout"))
      .mockResolvedValue("recovered");
    const result = await withRetry(fn, { attempts: 3, delayMs: 0 });
    expect(result).toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not retry on cancel error", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("user cancel"));
    await expect(withRetry(fn, { attempts: 3, delayMs: 0 })).rejects.toThrow("user cancel");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throws after max attempts", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("network timeout"));
    await expect(withRetry(fn, { attempts: 3, delayMs: 0 })).rejects.toThrow("network timeout");
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
