export const noop = <T extends (...args: any[]) => void>(
  ...args: Parameters<T>
) => undefined;
