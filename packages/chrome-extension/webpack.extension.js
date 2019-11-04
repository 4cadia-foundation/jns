const path = require('path');
const glob = require('glob');

const CopyPlugin = require('copy-webpack-plugin');

const files = glob.sync('./app/scripts/**/*.js', {
    dot: true,
    ignore: [
        './app/scripts/chromereload.js',
        './app/scripts/contentscript.js'
    ]
});

const contentFile = glob.sync('./app/scripts/contentscript.js');

const contentJs = {
    mode: 'development',
    entry: contentFile,
    devtool: 'inline-source-map',
    output: {
        filename: 'content.extension.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [path.resolve(__dirname, 'app')],
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }]
        }],
    }
};

const allJs = {
    mode: 'development',
    entry: files,
    devtool: 'inline-source-map',
    output: {
        filename: 'main.extension.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyPlugin([
            { from: path.resolve(__dirname, 'app/src/index.html'), to: path.resolve(__dirname, 'dist/index.html') },
            { from: path.resolve(__dirname, 'app/config'), to: path.resolve(__dirname, 'dist/config') },
            { from: path.resolve(__dirname, 'app/_locales'), to: path.resolve(__dirname, 'dist/_locales') },
            { from: path.resolve(__dirname, 'app/images'), to: path.resolve(__dirname, 'dist/images') },
            { from: path.resolve(__dirname, 'app/chromereload.js'), to: path.resolve(__dirname, 'dist') },
            { from: path.resolve(__dirname, 'app/manifest.json'), to: path.resolve(__dirname, 'dist') },
        ])
    ],
    module: {
        rules: [{
            test: /\.js$/,
            include: [path.resolve(__dirname, 'app')],
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }]
        }],
    }
};

module.exports = [
    allJs, contentJs
];