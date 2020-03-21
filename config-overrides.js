let {
  addDecoratorsLegacy,
  addPostcssPlugins,
  override
} = require("customize-cra");

module.exports = override(
  addDecoratorsLegacy(),
  addPostcssPlugins([require("tailwindcss"), require("autoprefixer")])
);
