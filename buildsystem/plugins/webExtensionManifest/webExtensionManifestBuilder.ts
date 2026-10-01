import { resolve } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { BrowserPlatform } from "./manifest.config.ts";

const ENTRY_TOKEN = "<<ENTRY>>";

export interface ManifestBuilderOptions {
  platform: BrowserPlatform;
  release: boolean;
  contentScriptEntry: string;
}

export const webExtensionManifestBuilder = function (
  options: ManifestBuilderOptions,
): Plugin {
  let config: ResolvedConfig;

  return {
    name: "manifest-builder",
    apply: "build",

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    // Evaluate the manifest source, apply the <<ENTRY>> replacement, emit manifest.json.
    async generateBundle(_outputOptions, bundle) {
      const entryModuleId = resolve(config.root, options.contentScriptEntry);

      // Find the correct asset name for the entry file, replace it in the code
      let entryFileName = "";
      for (const [buildFileName, buildChunk] of Object.entries(bundle)) {
        // This "facadeModuleId" DOES exist on the object.
        if ((buildChunk as never)["facadeModuleId"] === entryModuleId) {
          entryFileName = buildFileName;
        }
      }

      if (!entryFileName) {
        return this.error(
          "Unable to find content script entry to inject into manifest",
        );
      }

      const { buildManifest } = await import("./manifest.config.ts");

      const manifest = buildManifest(options.platform, options.release);
      let manifestJson = JSON.stringify(manifest, null, 2);
      manifestJson = manifestJson.replaceAll(ENTRY_TOKEN, entryFileName);

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: manifestJson,
      });
    },
  };
};
