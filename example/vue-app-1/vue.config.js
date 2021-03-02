/**
 *
 */
const StatsPlugin = require("stats-webpack-plugin");
module.exports = {
  chainWebpack: (config) => {
    config.parserOptions = {
      ecmaVersion: 6,
      sourceType: "module",
    };
  },
  publicPath: "http://127.0.0.1:3300/",
  devServer: {
    port: 3300,
    overlay: {
      warning: false,
      error: false,
    },
    hot: true,
    clientLogLevel: "warning",
  },
  configureWebpack: {
    output: {
      library: "vueApp1",
      libraryTarget: "window",
    },
    plugins: [
      new StatsPlugin("stats.json", {
        chunkModules: false,
        entrypoints: true,
        source: false,
        chunks: false,
        modules: false,
        assets: false,
        children: false,
        exclude: [/node_modules/],
      }),
    ],
  },
};
