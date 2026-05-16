import { resolve } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

const ENTRY_TOKEN = "<<ENTRY>>";
const SCRIPT_TOKEN = "<<SCRIPT>>";

export interface ManifestBuilderOptions {
  loaderScriptEntry: string;
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

    // Replace <<SCRIPT>> in loader.ts output with the real entrypoint filename.
    // renderChunk has access to meta.chunks which already has final filenames.
    renderChunk(code, chunk, _outputOptions, meta) {
      if (!code.includes(SCRIPT_TOKEN)) {
        return null;
      }

      const loaderModuleId = resolve(config.root, options.loaderScriptEntry);

      if (chunk.facadeModuleId !== loaderModuleId) {
        return null;
      }

      // Find the correct asset name for the entry file, replace it in the code
      const entryModuleId = resolve(config.root, options.contentScriptEntry);
      for (const [buildFileName, buildChunk] of Object.entries(meta.chunks)) {
        if (buildChunk.facadeModuleId === entryModuleId) {
          return code.replaceAll(SCRIPT_TOKEN, buildFileName);
        }
      }

      return this.error(
        `Failed to find entrypoint file asset in meta.chunks: ${entryModuleId} (${Object.keys(meta.chunks)})`,
      );
    },

    // Evaluate the manifest source, apply the same <<SCRIPT>> replacement, emit manifest.json.
    async generateBundle(_outputOptions, bundle) {
      const loaderModuleId = resolve(config.root, options.loaderScriptEntry);

      // Find the correct asset name for the loader file, replace it in the code
      let loaderFileName = "";
      for (const [buildFileName, buildChunk] of Object.entries(bundle)) {
        // This "facadeModuleId" DOES exist on the object.
        if ((buildChunk as never)["facadeModuleId"] === loaderModuleId) {
          loaderFileName = buildFileName;
        }
      }

      if (!loaderFileName) {
        return this.error(
          "Unable to find loader entry to inject into manifest",
        );
      }

      const { MANIFEST } = await import("./manifest.config");

      let manifestJson = JSON.stringify(MANIFEST, null, 2);
      manifestJson = manifestJson.replaceAll(ENTRY_TOKEN, loaderFileName);

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: manifestJson,
      });
    },
  };
};
