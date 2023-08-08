const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/dist_glance', to: 'dist_glance' },
            ],
        }),
    ],
};