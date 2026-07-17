import { safeAccessStorage } from "./storage/safeStorage.ts";
import { newConsoleLogger } from "./logger/console.ts";
import { executeOptOut } from "./sites/optOut.ts";
import type { Logger } from "./logger/logger.ts";
import { type CookieUpdater, safeCookieUpdater } from "./storage/safeCookie.ts";

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

  const createCookieUpdater = function (
    logger: Logger,
  ): CookieUpdater | undefined {
    try {
      // Intentional self assign to test if we can read and write to document.cookie
      // eslint-disable-next-line no-self-assign
      document.cookie = document.cookie;
    } catch (e) {
      logger.error(e, "Could not safely read from document.cookie");
      return undefined;
    }

    return safeCookieUpdater(
      logger,
      () => document.cookie,
      (cookie) => (document.cookie = cookie),
    );
  };

  const initialize = function (
    logger: Logger,
    safeCookie: CookieUpdater,
    safeStorage: Storage,
  ) {
    executeOptOut(logger, safeCookie, safeStorage);
  };

  const main = function () {
    const logger = newConsoleLogger();

    logger.log("Initializing...");

    const safeStorage = resolveSafeStorage(logger);
    if (!safeStorage) {
      logger.warn("No safeStorage: Extension can not continue!");
      return;
    }

    const safeCookie = createCookieUpdater(logger);
    if (!safeCookie) {
      logger.warn("No safeCookie: Extension can not continue!");
      return;
    }

    initialize(logger, safeCookie, safeStorage);
    logger.log("Initialized!");
  };

  main();
})();
