const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  //Чтобы не дублировать код импортируемых библиотек
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  return config;
}

module.exports = {
  context: path.resolve(__dirname, 'src', 'public'),
  mode: 'development',
  devtool: isProd ? false : 'cheap-inline-module-source-map',
  entry: {
    app: './index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist/public/'),
    filename: 'app.js',
  },
  optimization: optimization(),
  devServer: {
    port: 3300,
    hot: isDev,
    historyApiFallback: {
      index: 'index.html'
    }
  },
  resolve: {
    modules: [`${__dirname}/src/public`, 'node_modules'],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'src/public/index.html'),
      minify: {
        collapseWhitespace: isProd
      },
      excludeChunks: ['server']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public/favicon.ico'),
          to: path.resolve(__dirname, 'dist/public')
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src/public'),
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ['@babel/preset-env', {
              useBuiltIns: 'usage',
              corejs: 3,
            }],
            '@babel/preset-react'
          ],
          plugins:[
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-export-default-from'
          ]
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ]
      },
    ],
  }
};