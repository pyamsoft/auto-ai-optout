import { name, version } from "../package.json";

export const EXT_NAME = name;
export const EXT_VERSION = version;

export const EXT_DEBUG = import.meta.env.MODE === "development";
