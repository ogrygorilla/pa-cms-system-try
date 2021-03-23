const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {

  const isProd = argv.mode === 'production';
  const isDev = !isProd;

  console.log('isProd: ', isProd);
  console.log('isDev: ', isDev);

  const filename = (ext) => isProd ? `[name].[hash].bundle.${ext}` : `[name].bundle.${ext}`

  return {
    target: "web", // target for build
    context: path.resolve(__dirname, "src"),
    entry: {
      main: "./index.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: filename("js"),
      clean: true,
    },
    resolve: {
      extensions: [".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    devServer: {
      port: 3333,
      open: true, // opens browser window after server start^
      hot: true, // hot reload on file changes

    },
    devtool: isDev ? "source-map" : false,
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src", "favicon.ico"),
            to: path.resolve(__dirname, "dist"),
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: filename("css"),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
      ],
    },
  };
};
