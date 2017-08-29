/**
 * 开发脚本
 * [注] 无法进行刷新
 */

process.env.NODE_ENV = 'development'
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const compiler = webpack(require('../webpack.config.js'))

compiler.plugin('compilation', function (compilation) {
    console.log('编译完成')
})

const devServer = new WebpackDevServer(compiler, {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }
})
devServer.listen(8080, 'localhost', err => {
    if (err) {
        return console.error(err)
    }
    console.log('开发服务器启动完成')
})