export function throttle<T extends (...args: any) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();

    if (lastCallTime && now - lastCallTime < wait) {
      clearTimeout(timeout!);
      timeout = setTimeout(() => {
        lastCallTime = now;
        func.apply(this, lastArgs!);
      }, wait - (now - lastCallTime));
    } else {
      lastCallTime = now;
      func.apply(this, args);
    }
    lastArgs = args;
  };
}
