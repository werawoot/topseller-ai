type RetryOptions = {
  attempts?: number;
  delayMs?: number;
  shouldRetry?: (err: unknown) => boolean;
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { attempts = 3, delayMs = 800, shouldRetry = isRetryable } = options;

  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!shouldRetry(err) || i === attempts - 1) break;
      await sleep(delayMs * (i + 1)); // exponential backoff
    }
  }
  throw lastError;
}

function isRetryable(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    // ไม่ retry: user cancel, auth error, validation error
    if (msg.includes("cancel")) return false;
    if (msg.includes("invalid") && msg.includes("credential")) return false;
    if (msg.includes("not found")) return false;
    // retry: network, timeout, server error
    return (
      msg.includes("network") ||
      msg.includes("timeout") ||
      msg.includes("fetch") ||
      msg.includes("503") ||
      msg.includes("502") ||
      msg.includes("500")
    );
  }
  return false;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
