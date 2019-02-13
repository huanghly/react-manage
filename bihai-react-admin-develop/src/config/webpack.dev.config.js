const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require("webpack-dev-server");

module.exports = {
	devServer: {
	  inline: true, //开启页面自动刷新
	  lazy: false, //不启动懒加载
	  progress: true, //显示打包的进度
	  port: '3005', //设置端口号
	  host: '192.168.88.67', // 主机
	  //其实很简单的，只要配置这个参数就可以了
	  proxy: {
	      '/api/*': {
	          target: 'http://10.1.2.8',
	          changeOrigin: true,
	          secure: false,
	          pathRewrite: {
	            '^/api': ''
	          }
	      }
	  }
	}
}