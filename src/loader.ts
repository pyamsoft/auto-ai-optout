// Vite expects module based but chrome content scripts load as non-module
// JS
//
// In order to bridge the gap here, we have this script be the only directly loaded
// Chrome script, and we force all other scripts to load from the "jump point"
(() => {
  const getBrowser = function (): typeof chrome {
    // Firefox and Safari use "browser"
    try {
      return browser;
    } catch (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _e
    ) {
      // Otherwise we use "chrome"
      return chrome;
    }
  };

  const browser = getBrowser();

  // This <<SCRIPT>> string is replaced during the Vite build
  const script = browser.runtime.getURL("<<SCRIPT>>");

  // Load the script via import, which gives us access to ES6 modules from the script
  import(script);
})();
