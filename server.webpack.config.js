const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'server','server.js'),
    output: {
        path: path.resolve(__dirname, 'dist', 'server'),
        filename: 'server.js'
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/server/db'),
                    to: path.resolve(__dirname, 'dist/server/db/[name].[ext]'),
                    toType: 'template'
                },
                {
                    from: path.resolve(__dirname, 'src/server/stats.json'),
                    to: path.resolve(__dirname, 'dist/server/[name].[ext]'),
                    toType: 'template'
                },
                ]
        })
    ]
}