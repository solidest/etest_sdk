const path = require('path');

module.exports = {
    entry: {
        sdk_parser: './parser/src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: 'parser',
        libraryTarget: 'this',
    },
    mode: 'production',
};