const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = env => {
  return {
    entry: ['@babel/polyfill', './src/appRoot.js'],
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: "bundle.js"
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
      hot: true,
      port: 8081,
      https: true,
      proxy: {
        '/': {
          // target: 'https://54.255.215.252',
          target: 'localhost:3000'
          // secure: false
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", {
            loader: "less-loader",
            options: {
              javascriptEnabled: true,
              modifyVars: darkTheme || theme
            }
          }]
        },
        {//数据
            test: [/\.json$/i],//i不区分大小写
            exclude: /(node_modules|bower_components)/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        outputPath: './static/data/'//图片输出位置
                    }
                }
            ]
        },
        {
          test: /\.(gif|png|jpe?g)$/,
          loader: "file-loader"
        },
        {
          test: /\.html$/,
          loader: 'handlebars-loader'
        }
      ]
    },
    plugins: env.NODE_ENV === 'production' ? [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'bots data analytics: ' + (new Date()).toLocaleString() + " code edition"
      })
      // ,new BundleAnalyzerPlugin()
    ] : [new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'bots data analytics: ' + (new Date()).toLocaleString() + " code edition"
    })]
  };
};
