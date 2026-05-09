module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // SDK 54: babel-preset-expo 已自动注入 react-native-worklets/plugin
    // 不再需要手动添加 react-native-reanimated/plugin
  };
};
