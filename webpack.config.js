const path = require('path');
const process = require('process');
// плагины
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = true; // process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('IS DEV', isDev);

const optimization = () => {
  const config = {
    // директива для предотвращения повторной загрузки файлами модулей
    splitChunks: {
      chunks: 'all',
    },
  };
    // если продакшн, то минимизируем css
  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }
  return config;
};
// если разработка, то даём файлам просто имя, если продакшн-имя с хешем (для обновления кеша)
const filename = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
const cssLoaders = (extra) => {
  const loaders = [{
    loader: MiniCssExtractPlugin.loader,
    options: {
      // изменение сущности без перезагрузки страницы
      hmr: isDev,
      reloadAll: true,
    },
  },
  'css-loader'];
  if (extra) {
    loaders.push(extra);
  }
  return loaders;
};
const plugins = () => [
  // плагин для работы с html
  new HtmlWebpackPlugin({
    filename: '../build/pages/colors/colors.html',
    chunks: ['colors'],
    template: './pages/colors.pug',
    minify: {
      // минификация в режима прода
      collapseWhitespace: isProd,
    },
  }),
  new HtmlWebpackPlugin({
    filename: '../build/pages/cards/cards.html',
    chunks: ['cards'],
    template: './pages/cards.pug',
    minify: {
      // минификация в режима прода
      collapseWhitespace: isProd,
    },
  }),
  new HtmlWebpackPlugin({
    filename: '../build/pages/formElements/formElements.html',
    chunks: ['formElements'],
    template: './pages/formElements.pug',
    minify: {
      // минификация в режима прода
      collapseWhitespace: isProd,
    },
  }),
  // плагин для очистки ненужных файлов
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: filename('css'),
  }),
];
const babelOptions = (preset) => {
  const opts = {
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };
  if (preset) {
    opts.presets.push(preset);
  }
  return opts;
};
const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }];
  if (isDev) {
    loaders.push('eslint-loader');
  }
  return loaders;
};
module.exports = {
  // папка, отностельно которой работает вебпак
  context: path.resolve(__dirname, 'src'),
  // режим разработки
  mode: 'development',
  // входные точки
  entry: {
    colors: ['@babel/polyfill', './js/colors/main.js'],
    cards: ['@babel/polyfill', './js/cards/main.js'],
    formElements: ['@babel/polyfill', './js/form elements/main.js'],
  },
  // выходные точки
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    //  расширения файлов, которые можно считывать без указания расщирения
    extensions: ['.js', '.json'],
  },
  optimization: optimization(),
  // исходные карты для разработки (чтобы отлавливать ошибки), показывает исходный код
  devtool: isDev ? 'source-map' : '',
  // настройка для плагина, чтобы обновления появлялись во вкладке браузера сразу
  devServer: {
    port: 4200,
    // если режим разработки
    hot: isDev,
  },
  // плагины
  plugins: plugins(),
  // модули
  module: {
    // как считывать различные расширения файлов
    rules: [
      {
        test: /\.css$/,
        // Вынесение стилей в отдельный файл,добавление стилей в тег style, считывание css-файлов
        // use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader'],
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        // Вынесение стилей в отдельный файл,добавление стилей в тег style, считывание css-файлов
        // use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader'],
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.png|jpg|jpeg|svg|gif$/,
        use: ['file-loader'],
      },
      {
        test: /\.ttf|otf|woff|woff2|eot$/,
        use: ['file-loader'],
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
        options: {
          pretty: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: jsLoaders(),
      },
    ],
  },
};
