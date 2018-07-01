const { resolve } = require("path");

const dest = "docs";

module.exports = {
    entry: "./src/react-app.js",
    output: {
        path: resolve(dest),
        filename: "react-app.js"
    },
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