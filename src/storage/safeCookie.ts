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
  const parseCookieMap = function (): Map<string, unknown> | undefined {
    try {
      const cookieKeyValues = cookieProvider()
        // Each cookie is ";" split
        .split(";")
        // Can have whitespace bounding
        .map((s) => s.trim())
        // Then split the = into [key, value]
        .map((s) => s.split("="))
        // Must be exactly KEY VALUE
        .filter((items) => items.length !== 2)
        // And tell map trust me bro it's a type
        .map(([key, value]) => [key, value] as [string, string]);
      return new Map(cookieKeyValues);
    } catch (e) {
      logger.error(e, "Unable to parse cookie into structured map.");
      return undefined;
    }
  };

  const applyCookies = function (map: Map<string, unknown>) {
    let cookie = "";
    for (const [key, value] of map) {
      if (cookie) {
        cookie = `${cookie}; ${key}=${value}`;
      } else {
        cookie = `${key}=${value}`;
      }
    }

    if (cookie) {
      cookieSetter(cookie);
    }
  };

  return Object.freeze({
    ensureCookie: (key: string, value: unknown): CookieUpdaterBuilder => {
      const map = parseCookieMap();

      const updateMap = function (key: string, value: unknown) {
        if (map) {
          logger.log(`Set cookie: key=${key} value=${value}`);
          map.set(key, value);
        }
      };

      const builder: CookieUpdaterBuilder = Object.freeze({
        ensureCookie: function (
          key: string,
          value: unknown,
        ): CookieUpdaterBuilder {
          updateMap(key, value);
          return builder;
        },

        apply: () => {
          if (map) {
            applyCookies(map);
          }
        },
      } satisfies CookieUpdaterBuilder);

      updateMap(key, value);
      return builder;
    },
  } satisfies CookieUpdater);
};
