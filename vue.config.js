const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    host: "10.16.49.224",
    port: 8080,
    // 代理配置
    proxy: {
      "/echarts": {
        target: "https://echarts.apache.org/examples", // 我们要代理的地址
        pathRewrite: {
          "^/echarts": "",
        },
      },
      "/api": {
        // target:"http://10.16.58.159:8189",
        target: "http://localhost:8082", // 我们要代理的地址，实验室地址
        // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        pathRewrite: {
          "^/api": "",
        },
      },
      "/":{
        target: "http://localhost:8082", // 我们要代理的地址，实验室地址
        // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        pathRewrite: {
          "^/": "/",
        },
      }
    },
  },
});



