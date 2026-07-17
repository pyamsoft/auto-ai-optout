import type { Logger } from "../logger/logger.ts";
import { optOutTraining as chatGptOptOutTraining } from "./ai/chatgpt/optOutTraining.ts";
import { optOutAds as chatGptOptOutAds } from "./ai/chatgpt/optOutAds.ts";
import type { CookieUpdater } from "../storage/safeCookie.ts";

export const executeOptOut = function (
  logger: Logger,
  cookie: CookieUpdater,
  storage: Storage,
) {
  // ChatGPT
  logger.log("Opt out ChatGPT ads and training");
  chatGptOptOutAds(cookie, storage);
  chatGptOptOutTraining(cookie, storage);
};
