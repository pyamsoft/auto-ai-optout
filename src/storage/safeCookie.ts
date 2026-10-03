import type { Logger } from "../logger/logger.ts";

export interface CookieUpdater {
  ensureCookie: (key: string, value: unknown) => CookieUpdaterBuilder;
}

export interface CookieUpdaterBuilder extends CookieUpdater {
  apply: () => void;
}

export const safeCookieUpdater = function (
  logger: Logger,
  cookieProvider: () => string,
  cookieSetter: (cookie: string) => void,
): CookieUpdater {
  const parseCookieMap = function (): Map<string, string> | undefined {
    try {
      const cookieKeyValues = cookieProvider()
        // Each cookie is ";" split
        .split(";")
        // Can have whitespace bounding
        .map((s) => s.trim())
        // Must be KEY=VALUE
        .filter((s) => s.includes("="))
        // Split on the first = only, values can contain =
        .map((s) => {
          const index = s.indexOf("=");
          return [s.slice(0, index), s.slice(index + 1)] as [string, string];
        });
      return new Map(cookieKeyValues);
    } catch (e) {
      logger.error(e, "Unable to parse cookie into structured map.");
      return undefined;
    }
  };

  const applyCookies = function (updates: Map<string, unknown>) {
    const existing = parseCookieMap();
    if (!existing) {
      return;
    }

    // document.cookie only sets one cookie per assignment
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#write_a_new_cookie
    for (const [key, value] of updates) {
      if (existing.get(key) === String(value)) {
        continue;
      }

      try {
        logger.log(`Set cookie: key=${key} value=${value}`);
        cookieSetter(`${key}=${value}`);
      } catch (e) {
        logger.error(e, "Unable to set cookie:", key);
      }
    }
  };

  return Object.freeze({
    ensureCookie: (key: string, value: unknown): CookieUpdaterBuilder => {
      const updates = new Map<string, unknown>();

      const builder: CookieUpdaterBuilder = Object.freeze({
        ensureCookie: function (
          key: string,
          value: unknown,
        ): CookieUpdaterBuilder {
          updates.set(key, value);
          return builder;
        },

        apply: () => {
          applyCookies(updates);
        },
      } satisfies CookieUpdaterBuilder);

      updates.set(key, value);
      return builder;
    },
  } satisfies CookieUpdater);
};
