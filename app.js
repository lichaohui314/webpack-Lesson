let express = require("express");
let app = express();
let webpack = require('webpack');
let middle = require("webpack-dev-middleware")
let config = require("./webpack.config.js")
let compiler = webpack(config);    //用webpack编译webpack配置文件
app.use(middle(compiler));   //用middle中间件启动webpack和当前服务器同源
// 在服务端启动webpack  好处是同一个端口不存在跨域
app.get('/a', function (req, res) {
    res.json({
        name: "vision"
    })
})
app.listen(3000)
