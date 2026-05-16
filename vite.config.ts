import { defineConfig } from "vite";
import { webExtensionManifestBuilder } from "./buildsystem/plugins/webExtensionManifest/webExtensionManifestBuilder";
import { removeVitePreloadFromCommonJs } from "./buildsystem/plugins/removeVitePreload/removeVitePreloadFromCommonJs";

export default defineConfig((env) => {
  const loaderScript = "src/loader.ts";
  const entryPointScript = "src/entrypoint.ts";

  const isDebug = env.mode === "development";
  return {
    build: {
      // Disable module preload, we don't need it since the extension has no HTML
      //
      // see [removeVitePreloadFromCommonJs] plugin
      modulePreload: false,

      emptyOutDir: true,
      outDir: "dist",

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
        loaderScriptEntry: loaderScript,
        contentScriptEntry: entryPointScript,
      }),
    ],
  };
});
