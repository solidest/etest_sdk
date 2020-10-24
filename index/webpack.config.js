const path = require('path');

module.exports = {
    entry: {
        sdk: './index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'sdk',
        libraryTarget: 'this',
    },
    externals: {
        fs: {
            commonjs: 'fs',
            commonjs2: 'fs',
            amd: 'fs',
        },
        path: {
            commonjs: 'path',
            commonjs2: 'path',
            amd: 'path',
        }
    },
    performance: {
        maxAssetSize: 1024*300, // 整数类型（以字节为单位）
        maxEntrypointSize: 1024*300, // 整数类型（以字节为单位）
    },

    mode: 'production',
};