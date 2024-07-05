const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const path = require("path"); // Import the path module
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file, if present
dotenv.config();

module.exports = (options) => {
  return {
    entry: "./index.js",
    output: {
      filename: "bundle.js",
      publicPath: "auto",
      uniqueName: "child-react",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                cacheDirectory: true,
                presets: ["@babel/react", "@babel/env"],
              },
            }
          ],
        },,
        {
          // Add a rule for CSS files
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "reactChild",
        filename: "remoteEntry.js",
        exposes: {
          "./web-components": "./src/index.js",
        },
        shared: ["react", "react-dom"],
      }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
    devServer: {
      port: 4204,
    },
    resolve: {
      // Configure how modules are resolved.
      modules: [path.resolve(__dirname, 'src'), 'node_modules'], // Add 'src' to the modules array
      extensions: ['.js', '.jsx'], // Resolve these extensions
    },
  };
};