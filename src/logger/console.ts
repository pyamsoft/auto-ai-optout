import type { Logger } from "./logger.ts";
import { EXT_DEBUG, EXT_NAME, EXT_VERSION } from "../env.ts";

const TAG = `[${EXT_NAME} (${EXT_VERSION})]:`;

export const newConsoleLogger = function (): Logger {
  return {
    log: (...args) => {
      if (EXT_DEBUG) {
        console.log(TAG, ...args);
      }
    },
    warn: (...args) => {
      if (EXT_DEBUG) {
        console.warn(TAG, ...args);
      }
    },
    error: (...args) => {
      if (EXT_DEBUG) {
        console.error(TAG, ...args);
      }
    },
  };
};
