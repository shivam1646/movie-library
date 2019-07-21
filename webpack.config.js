const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const isDevelopment = process.env.NODE_ENV !== 'production';

// webpack configuration
const config = {
    mode: isDevelopment ? 'development' : 'production',

    // entry point
    entry: {
        app: ['./src/index.js', './src/index.scss']
    },

    // output folder
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isDevelopment  ? '[name].bundle.js' : '[name].[hash].bundle.js'
    },

    // listen to changes using dev server
    devServer: {
        contentBase: './dist',
        writeToDisk: true
    },
    
    // loaders
    module: {
        rules : [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                use: [
                  {
                    loader: "html-loader",
                    options: { minimize: true }
                  }
                ]
            }
        ]
    },

    // plugins
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Movie Library',
            template: 'src/index.ejs',
            favicon: 'src/assets/favicon.ICO'
        }),
        new CleanWebpackPlugin()
    ],
};

module.exports = config;