// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/talks",
    createProxyMiddleware({
      target: "https://api.d-id.com",
      changeOrigin: true,
    })
  );
};
