export interface Logger {
  log: (...args: readonly unknown[]) => void;

  warn: (...args: readonly unknown[]) => void;

  error: (...args: readonly unknown[]) => void;
}
