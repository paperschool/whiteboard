module.exports = {
    module: {
        rules: [],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss', '.json'],
    },
    // socket io though referencing this package does not use it ever
    externals: {
        uws: 'uws'
    }
}