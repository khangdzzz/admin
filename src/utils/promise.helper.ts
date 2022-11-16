export function timeout(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, ms);
    if (signal)
      signal.addEventListener("abort", () => {
        clearInterval(timeoutId);
        reject("Promise aborted");
      });
  });
}
