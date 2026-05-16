import {
  description as pkgDescription,
  name as pkgName,
  version as pkgVersion,
} from "../../../package.json";

const WEBSITE_CHATGPT = ["https://chatgpt.com/*", "https://*.chatgpt.com/*"];
const SUPPORTED_WEBSITES = [...WEBSITE_CHATGPT];

// noinspection JSUnusedGlobalSymbols
export const MANIFEST = {
  manifest_version: 3,
  name: pkgName,
  version: pkgVersion,
  description: pkgDescription,
  content_scripts: [
    {
      js: ["<<ENTRY>>"],
      matches: SUPPORTED_WEBSITES,
    },
  ],
  web_accessible_resources: [
    {
      // Path must be set to /* for Chrome
      matches: SUPPORTED_WEBSITES,
      resources: [
        // All script chunks
        "assets/*.js",
      ],
    },
  ],
  host_permissions: SUPPORTED_WEBSITES,
};
