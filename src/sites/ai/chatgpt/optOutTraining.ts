import type { CookieUpdater } from "../../../storage/safeCookie.ts";

const OPT_OUT_KEYS = new Map([
  ["oai/apps/isNoAuthChatTrainingEnabled", String(false)],
]);

export const optOutTraining = function (
  safeCookie: CookieUpdater,
  safeStorage: Storage,
) {
  // Old location in localstorage
  for (const [key, value] of OPT_OUT_KEYS) {
    safeStorage.setItem(key, value);
  }

  // New location in document.cookie
  safeCookie.ensureCookie("oai-no-auth-training-disabled", 1).apply();
};
