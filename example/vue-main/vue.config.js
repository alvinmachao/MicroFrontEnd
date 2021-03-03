module.exports = {
  chainWebpack: (config) => {
    config.parserOptions = {
      ecmaVersion: 6,
      sourceType: "module",
    };
  },
  productionSourceMap: true,
  devServer: {
    port: 10000,
    overlay: {
      warnings: false,
      errors: false,
    },
    hot: true,
    clientLogLevel: "warning",
    proxy: {
      "/app1-api": {
        target: "http://127.0.0.1:3300",
        bypass: function(req, res, proxyOptions) {},
        pathRewrite: {
          "^/app1-api": "/",
        },
      },
      "/app2-api": {
        target: "http://127.0.0.1:3400",
        bypass: function(req, res, proxyOptions) {},
        pathRewrite: {
          "^/app2-api": "/",
        },
      },
    },
  },
};
