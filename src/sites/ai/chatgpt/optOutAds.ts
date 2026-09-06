import type { CookieUpdater } from "../../../storage/safeCookie.ts";

const OPT_OUT_KEYS = new Map([
  [
    "oai/apps/noAuthAdsControls",
    JSON.stringify({
      personalizationEnabled: false,
    }),
  ],
]);

export const optOutAds = function (
  safeCookie: CookieUpdater,
  safeStorage: Storage,
) {
  // Old location in Local storage
  for (const [key, value] of OPT_OUT_KEYS) {
    safeStorage.setItem(key, value);
  }

  // New location in document.cookie
  safeCookie
    .ensureCookie("oai_consent_analytics", false)
    .ensureCookie("oai_consent_marketing", false)
    .ensureCookie("oai_consent_personalization", false)
    // Noticed as of Sep 6, 2026
    .ensureCookie("oai-no-auth-training-disabled", 1)
    .apply();
};
