import { safeAccessStorage } from "./storage/safeStorage.ts";
import { newConsoleLogger } from "./logger/console.ts";
import { executeOptOut } from "./sites/optOut.ts";
import type { Logger } from "./logger/logger.ts";

(() => {
  const resolveSafeStorage = function (logger: Logger): Storage | undefined {
    let safeStorage: Storage;
    if ("localStorage" in window) {
      try {
        safeStorage = safeAccessStorage(logger, window.localStorage);
      } catch (e) {
        logger.error(e, "Unable to initialize safe window.localStorage");
        return undefined;
      }
    } else {
      logger.warn("Could not access window.localStorage.");
      return undefined;
    }

    return safeStorage;
  };

  const initialize = function (logger: Logger, safeStorage: Storage) {
    executeOptOut(logger, safeStorage);
  };

  const main = function () {
    const logger = newConsoleLogger();

    logger.log("Initializing...");

    const safeStorage = resolveSafeStorage(logger);
    if (!safeStorage) {
      logger.warn("Extension can not continue!");
      return;
    }

    initialize(logger, safeStorage);
    logger.log("Initialized!");
  };

  main();
})();
