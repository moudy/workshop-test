import path from 'path';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';

const isProduction = process.env.NODE_ENV === 'production';

const clientRoot = path.join(__dirname, '../client');

const rules = [
  {
    test: /.ts(x?)$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
          configFile: path.resolve(clientRoot, 'tsconfig.json'),
        },
      },
    ],
    include: clientRoot,
  },
];

const compiler = webpack({
  mode: isProduction ? 'production' : 'development',
  watch: !isProduction,
  target: 'web',
  entry: path.resolve(clientRoot, 'index.tsx'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    symlinks: false,
  },
  module: {
    rules,
  },
});

export default middleware(compiler, {
  publicPath: '/public',
});
