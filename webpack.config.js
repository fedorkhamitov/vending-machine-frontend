const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true,
    publicPath: "/",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/i,
        type: "asset/resource",
        generator: {
          filename: "icons/[hash][ext][query]", // куда складывать иконки в dist
        },
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  devServer: {
    static: "./dist",
    historyApiFallback: true,
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5017",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
        withCredentials: true,
      },
      "/images": {
        target: "http://localhost:5017",
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
