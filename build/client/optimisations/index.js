module.exports = {
    splitChunks: {
        cacheGroups: {
            defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: 0
            },
            default: {
                minChunks: 2,
                priority: 1,
                reuseExistingChunk: true
            }
        },
        chunks: 'all'
    }
}