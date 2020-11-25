const path = require('path');

module.exports = {
    entry: {
        sdk_converter: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'converter',
        libraryTarget: 'this',
    },
    externals: {
        fs: {
            commonjs: 'fs',
            commonjs2: 'fs',
            amd: 'fs',
        }
    },
    performance: {
        maxAssetSize: 1024*300, // 整数类型（以字节为单位）
        maxEntrypointSize: 1024*300, // 整数类型（以字节为单位）
    },

    mode: 'production',
};


// npx webpack