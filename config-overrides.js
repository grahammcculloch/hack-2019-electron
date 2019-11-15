const {
  addDecoratorsLegacy,
  override,
  disableEsLint
} = require("customize-cra");

module.exports = {
  webpack: override(
      // config => { config.target = 'electron-renderer'; return config; },
      addDecoratorsLegacy(),
      disableEsLint()
  )
};