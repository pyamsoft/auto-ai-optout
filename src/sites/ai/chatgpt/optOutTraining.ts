const OPT_OUT_KEYS = new Map([
  ["oai/apps/isNoAuthChatTrainingEnabled", String(false)],
]);

/**
 * ChatGPT stores it's data training permission in localStorage
 */
export const optOutTraining = function (safeStorage: Storage) {
  for (const [key, value] of OPT_OUT_KEYS) {
    safeStorage.setItem(key, value);
  }
};
