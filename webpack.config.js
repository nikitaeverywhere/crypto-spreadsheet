const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const dest = "docs";

module.exports = {
    entry: "./src/react-app.js",
    output: {
        path: resolve(dest),
        filename: "react-app.js"
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/index.html", to: `index.html` },
            { from: "src/favicon.png", to: `favicon.png` }
        ], {
            force: true
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: require.resolve("style-loader"),
                    },
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: require.resolve("sass-loader"),
                    },
                ]
            }
        ]
    }
};