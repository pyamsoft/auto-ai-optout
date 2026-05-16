import type { Plugin, ResolvedConfig } from "vite";

const BAD_PLUGIN_NAMES = Object.freeze(
  new Set(["native:modulepreload-polyfill", "native:import-analysis-build"]),
);

/**
 * Vite injects a __vitePreload helper into scripts, assuming they are ES6 modules.
 * Chrome content scripts loaded as classic scripts don't need it, and it
 * will cause initialization to break. It also references scripts and HTML and stuff
 * that just isn't needed in an extension
 *
 * The preload chunk of code is injected from the "vite:build-import-analysis"
 * plugin, which is otherwise useless in extensions.
 *
 * YOU MUST DECLARE YOUR PROJECT AS "module" in package.json or vite will add imports and
 * exports and other JS that breaks.
 *
 * Remove it.
 */
export const removeVitePreloadFromCommonJs = function (): Plugin {
  return {
    name: "remove-vite-preload-from-commonjs",
    apply: "build",

    configResolved(config: ResolvedConfig) {
      const plugins = [...config.plugins];
      for (let i = plugins.length - 1; i >= 0; --i) {
        const plugin = plugins[i];
        if (BAD_PLUGIN_NAMES.has(plugin.name)) {
          config.logger.info(`Removing bad _preload extension: ${plugin.name}`);
          plugins.splice(i, 1);
        }
      }

      // @ts-expect-error I know this says it's "readonly" but nothing is really readonly in javascript :)
      config.plugins = plugins;
    },
  };
};
