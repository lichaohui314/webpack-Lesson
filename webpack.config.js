let path = require("path");
let express = require('express');
let app = express();
let HtmlWebpcakPlugin = require("html-webpack-plugin");
let MiniCssExtractPlugin = require("mini-css-extract-plugin");
let OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
let TerserWebpackPlugin = require("terser-webpack-plugin")
let webpack = require('webpack')
let AddAssetHtmlCdnWebpackPlugin = require("add-asset-html-cdn-webpack-plugin")
// let { CleanWebpackPlugin } = require('clean-webpack-plugin')
let CopyWebpackPlugin = require("copy-webpack-plugin")
let happypack = require("happypack");
let VueLoaderPlugin = require('vue-loader/lib/plugin')
//reslove函数用来返回一个绝对路径
let resolve = file => {
    return path.resolve(__dirname, file);
};
module.exports = {
    mode: "production",
    entry: "./src/index.js",
    output: {
        path: resolve("dist"),
        filename: 'js/main.js',
        // publicPath: "www.baidu.com"
    },
    devtool: 'source-map',   //源码映射


    // 服务端启动 不需要devServer 

    devServer: {
        // before(app) {
        //     app.get('/abc', function (req, res) {
        //         res.json('这是webpack提供的数据');
        //     })
        // },
        port: 3000,
        contentBase: "./dist",
        compress: true,
        open: true,
        proxy: {},
        overlay: true,    //报错的时候出现遮挡  一般不配置
        hot: true,    //告诉devServer启用热更新
    },
    // 优化项
    optimization: {
        usedExports: true,   //没用的代码会标识
        minimizer: [
            new OptimizeCssAssetsWebpackPlugin({}),
            new TerserWebpackPlugin({}),
            new webpack.ProvidePlugin({
                $: "jquery"
            }),
            new AddAssetHtmlCdnWebpackPlugin(true, {
                jquery: "https://cdn.bootcss.com/jquery/3.4.1/jquery.js"
            })
        ]

    },
    // 配置忽略打包项
    externals: {
        jquery: "jQuery",
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),     //启动热更新插件
        new webpack.NamedModulesPlugin(),   //提示哪个模块更新
        new HtmlWebpcakPlugin({
            template: "./public/index.html",
            filename: "index.html",
            hash: true,
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: "css/main.css" //抽离出来的css的文件名
        }),
        // new CleanWebpackPlugin(),
        new webpack.BannerPlugin('make by Lq'),    //版权插件
        new CopyWebpackPlugin([
            {
                from: './src/static',
                to: './static'
            }
        ]),
        new webpack.DefinePlugin({
            // 字符串必须包两层
            env: JSON.stringify("production")
        }),
        new happypack({
            id: 'js',
            use: ["babel-loader"],
        }),
        // new happypack({
        //     id: 'css',
        //     use: ['vue-style-loader', "css-loader"],
        // }),
        new VueLoaderPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            "@": resolve('src'),
            vue$: "vue/dist/vue.esm.js"
        }
    },
    module: {
        noParse: '/jquery/',
        rules: [
            {
                test: /\.vue$/,
                use: "vue-loader",
            },
            // {
            //     test: require.resolve("jquery"),
            //     use: "expose-loader?$"
            // },
            {
                test: /\.(jpg|png|gif|jpeg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1 * 1024,
                        outputPath: '/img/',    //图片打包之后的路径
                    }
                }
            },
            {
                test: /\.html$/,
                use: 'html-withimg-loader'
            },
            {
                test: /\.css$/,
                // use: 'happypack/loader?id=css'
                use: ['vue-style-loader', "css-loader"],
                // use: [MiniCssExtractPlugin.loader, "css-loader", 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: resolve('src'),
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: "happypack/loader?id=js",
            }
            // {
            //     enforce: "pre",
            //     test: /\.js$/,
            //     use: "eslint-loader"
            // }
        ]
    },

};