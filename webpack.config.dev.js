const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const rules = [
  {
    test: /.ts$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
          configFile: path.resolve(__dirname, 'tsconfig.server.json'),
        },
      },
    ],
    include: path.resolve(__dirname, 'server'),
  },
];

module.exports = {
  mode: 'development',
  entry: './server/index.ts',
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack-hot-middleware/client'],
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    symlinks: false,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
  module: { rules },
};
