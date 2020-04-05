const path = require("path");
const baseConfig = require("../base.webpack.config.js");
const plugins = require("./plugins");
const rules = require("./rules");

module.exports = (env, { mode }) => {
    const isProduction = mode === "production";

    return {
        ...baseConfig,
        mode: isProduction ? 'production' : 'development',
        target: "node",
        node: {
            __dirname: false
        },
        module: {
            rules: [...rules],
        },
        plugins: plugins,
        devtool: isProduction ? 'none' : 'source-map',
        entry: "./app/server/index.js",
        output: {
            filename: 'server.bundle.js',
            path: path.resolve(__dirname, '../../bin/server'),
        }
    }
};