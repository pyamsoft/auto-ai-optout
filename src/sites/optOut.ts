import type { Logger } from "../logger/logger.ts";
import { optOutTraining as chatGptOptOutTraining } from "./ai/chatgpt/optOutTraining.ts";
import { optOutAds as chatGptOptOutAds } from "./ai/chatgpt/optOutAds.ts";

export const executeOptOut = function (logger: Logger, storage: Storage) {
  // ChatGPT
  logger.log("Opt out ChatGPT ads and training");
  chatGptOptOutAds(storage);
  chatGptOptOutTraining(storage);
};
