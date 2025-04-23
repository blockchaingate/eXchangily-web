const TerserPlugin = require('terser-webpack-plugin');
const webpack_1 = require("webpack");

module.exports = {

    optimization: {
        minimizer: [
            new webpack_1.HashedModuleIdsPlugin(),
            new TerserPlugin(
                {
                    terserOptions: {
                        mangle: {
                            reserved: ['Array', 'BigInteger', 'Boolean', 'ECPair', 'Function', 'Number', 'Point', 'Script']
                        },
                        cache:true,
                        parallel: true,
                        compress: true
                    }
                }
            )]
    }
};
