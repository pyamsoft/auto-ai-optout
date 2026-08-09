import { defineConfig } from "vite";
import { webExtensionManifestBuilder } from "./buildsystem/plugins/webExtensionManifest/webExtensionManifestBuilder.ts";
import { removeVitePreloadFromCommonJs } from "./buildsystem/plugins/removeVitePreload/removeVitePreloadFromCommonJs.ts";
import { BrowserPlatform } from "./buildsystem/plugins/webExtensionManifest/manifest.config.ts";
import { join } from "node:path";

export default defineConfig((env) => {
  const loaderScript = "src/loader.ts";
  const entryPointScript = "src/entrypoint.ts";

  const isDebug = env.mode === "development";
  const isFirefox = process.env.__FIREFOX__ === "1";
  const isChrome = process.env.__CHROME__ === "1";

  let platform: BrowserPlatform;
  if (isChrome) {
    platform = BrowserPlatform.CHROME;
  } else if (isFirefox) {
    platform = BrowserPlatform.FIREFOX;
  } else {
    throw new Error(
      "Unsupported browser platform. Must be one of: 'chrome', 'firefox'",
    );
  }

  return {
    build: {
      // Disable module preload, we don't need it since the extension has no HTML
      //
      // see [removeVitePreloadFromCommonJs] plugin
      modulePreload: false,

      emptyOutDir: true,
      outDir: join("dist", platform),

      minify: !isDebug,
      cssMinify: !isDebug,
      sourcemap: isDebug,

      rollupOptions: {
        treeshake: true,
        output: {
          minifyInternalExports: true,
        },
        input: {
          loader: loaderScript,
          entrypoint: entryPointScript,
        },
      },
    },
    plugins: [
      removeVitePreloadFromCommonJs(),
      webExtensionManifestBuilder({
        platform,
        release: !isDebug,
        loaderScriptEntry: loaderScript,
        contentScriptEntry: entryPointScript,
      }),
    ],
  };
});
