var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
    entry: {
        'index': './src/index.js'
    },
    output: {
        path : __dirname + '/dist',
        filename: '[name].[hash].js',
        publicPath: process.env.NODE_ENV === 'development' ? '/' : '/cmsfont/',
        // publicPath: '/',
        chunkFilename:'[id].[chunkhash].js'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015', 'stage-0', 'react']
            }
        }, {
            test: /\.scss$/,
            loader: 'style-loader!css-loader!sass-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.png$/,
            loader: "url-loader",
            query: { mimetype: "image/png" }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html'),
            filename: 'index.html',
            inject: 'body',
            chunksSortMode: 'dependency'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                // any required modules inside node_modules are extracted to vendor
                return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, './node_modules')
                ) === 0
                )
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            chunks: ['vendor']
        }),
    ],
    resolve: {		
        mainFiles: ["index.web","index"],// 这里哦
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
            '@': __dirname,
        },
    }
};

if(process.env.NODE_ENV !== 'development') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            'screw_ie8': true,
            'warnings': false,
            'unused': true,
            'dead_code': true,
        },
        output: {
            comments: false,
        },
        sourceMap: false,
    }))
} else {
    // 开发环境的配置
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.devServer = {
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        },
        disableHostCheck: true,
        contentBase: path.join(__dirname, 'static')
    }
    config.devtool = '#cheap-module-eval-source-map'
}


module.exports = config