export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  wait: number
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      callback.apply(args);
    }, wait ?? 0);
  };
}
