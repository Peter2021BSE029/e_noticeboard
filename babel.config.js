module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      // For loading environment variables
      ['module:react-native-dotenv'],
    ],
  };
};
