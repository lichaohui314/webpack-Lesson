let autoprefixer = require('autoprefixer');
let postcssPresetEnv = require('postcss-preset-env');
module.exports = {
    plugins: [postcssPresetEnv, autoprefixer({})]
}