const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Preserve function names in production builds.
// expo-font passes a function (not a class) to registerWebModule(),
// and the minifier strips the function name, causing:
// "Module implementation must be a class"
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer?.minifierConfig,
    mangle: {
      ...config.transformer?.minifierConfig?.mangle,
      keep_fnames: true,
    },
  },
};

module.exports = config;
