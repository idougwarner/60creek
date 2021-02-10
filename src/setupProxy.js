const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/v2/qdf.php",
    createProxyMiddleware({
      target: "https://api.datafinder.com",
      changeOrigin: true,
    })
  );
};
