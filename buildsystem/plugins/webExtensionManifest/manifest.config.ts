import {
  description as pkgDescription,
  homepage as pkgHomePage,
  name as pkgName,
  version as pkgVersion,
} from "../../../package.json";

const WEBSITE_CHATGPT = ["https://chatgpt.com/*", "https://*.chatgpt.com/*"];
const SUPPORTED_WEBSITES = [...WEBSITE_CHATGPT];

type RequiredDataCollectionPermissions =
  | "authenticationInfo"
  | "bookmarksInfo"
  | "browsingActivity"
  | "financialAndPaymentInfo"
  | "healthInfo"
  | "locationInfo"
  | "personalCommunications"
  | "personallyIdentifyingInfo"
  | "searchTerms"
  | "websiteActivity"
  | "websiteContent";

const NO_REQUIRED_PERMISSIONS = Object.freeze(["none"]);

interface BrowserSpecificSettings {
  gecko?: {
    id: string;
    data_collection_permissions: {
      required:
        typeof NO_REQUIRED_PERMISSIONS | RequiredDataCollectionPermissions[];
      optional?: readonly string[];
    };
  };
}

type BuiltManifest = chrome.runtime.ManifestV3 & {
  browser_specific_settings?: BrowserSpecificSettings;
};

export const enum BrowserPlatform {
  CHROME = "chrome",
  FIREFOX = "firefox",
}

// noinspection JSUnusedGlobalSymbols
export const buildManifest = function (
  platform: BrowserPlatform,
): chrome.runtime.ManifestV3 {
  const manifest: BuiltManifest = {
    manifest_version: 3,
    name: pkgName,
    version: pkgVersion,
    description: pkgDescription,
    homepage_url: pkgHomePage,
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

  if (platform === BrowserPlatform.FIREFOX) {
    manifest.browser_specific_settings = {
      gecko: {
        id: "{dbd7b55e-20ec-4f74-af18-79574d15f1bf}",
        data_collection_permissions: {
          required: NO_REQUIRED_PERMISSIONS,
        },
      },
    };
  }

  return manifest;
};
