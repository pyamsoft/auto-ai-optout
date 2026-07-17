import type { Logger } from "../logger/logger.ts";

export const safeAccessStorage = function <T extends Storage>(
  logger: Logger,
  storage: T,
): T {
  return Object.freeze({
    get length(): number {
      try {
        return storage.length;
      } catch (e) {
        logger.error(e, "Unable to get storage length");
        return 0;
      }
    },
    clear() {
      try {
        storage.clear();
      } catch (e) {
        logger.error(e, "Unable to clear storage");
      }
    },
    getItem(key: string): string | null {
      try {
        return storage.getItem(key);
      } catch (e) {
        logger.error(e, "Unable to getItem from storage:", key);
        return null;
      }
    },
    key(index: number): string | null {
      try {
        return storage.key(index);
      } catch (e) {
        logger.error(e, "Unable to find key in storage:", index);
        return null;
      }
    },
    removeItem(key: string) {
      try {
        return storage.removeItem(key);
      } catch (e) {
        logger.error(e, "Unable to removeItem from storage:", key);
        return null;
      }
    },
    setItem(key: string, value: string) {
      try {
        storage.setItem(key, value);
      } catch (e) {
        logger.error(e, "Unable to setItem to storage:", { key, value });
      }
    },
  } satisfies Storage as T);
};
