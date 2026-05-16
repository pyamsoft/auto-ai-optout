const OPT_OUT_KEYS = new Map([
  [
    "oai/apps/noAuthAdsControls",
    JSON.stringify({
      personalizationEnabled: false,
    }),
  ],
]);

/**
 * ChatGPT stores it's ads permission in localStorage
 */
export const optOutAds = function (safeStorage: Storage) {
  for (const [key, value] of OPT_OUT_KEYS) {
    safeStorage.setItem(key, value);
  }
};
