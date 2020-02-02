import fs from 'fs';
import path from 'path';
import glob from 'glob';
import express from 'express';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import ReactRefreshPlugin from '@webhotelier/webpack-fast-refresh';
import * as rdt from 'react-docgen-typescript';

const isProduction = process.env.NODE_ENV === 'production';

const componentsRoot = path.join(__dirname, '../src');
const parser = rdt.withCustomConfig(
  path.resolve(componentsRoot, 'tsconfig.json'),
  {},
);

const rules = [
  {
    test: /\.(ts)x?$/,
    include: componentsRoot,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          '@babel/preset-typescript',
          '@babel/preset-react',
        ],
      },
    },
  },
];

const files = glob.sync('**/*.tsx', { cwd: componentsRoot });

const genEntry = () => {
  const root = files.reduce(
    (acc: Array<[string, Array<string>]>, file: string) => {
      const parsed = parser.parse(path.resolve(componentsRoot, file));
      const filename = file.replace(/\.tsx$/, '');

      const sub: Array<string> = [];

      parsed.forEach((component) => {
        const { displayName } = component;

        if (!/[A-Z]/.test(displayName)) {
          return;
        }

        const defaultExport =
          filename === displayName || filename.endsWith(`/${displayName}`);

        sub.push(
          `${displayName}: require('./${filename}')['${
            defaultExport ? 'default' : displayName
          }'],`,
        );
      });

      if (sub.length) {
        acc.push([filename, sub]);
      }

      return acc;
    },
    [],
  );

  const lines = ['window.__COMPONENTS__ = {'];

  root.forEach(([filename, components]) => {
    lines.push([`${filename}: {`, ...components, '}'].join('\n'));
  });

  fs.writeFileSync(
    path.resolve(componentsRoot, '__components.tsx'),
    [...lines, '}'].join('\n'),
  );
};

export default (app: express.Application) => {
  genEntry();

  const compiler = webpack({
    mode: isProduction ? 'production' : 'development',
    watch: !isProduction,
    target: 'web',
    entry: [
      require.resolve('webpack-hot-middleware/client'),
      path.resolve(componentsRoot, '__components.tsx'),
    ],
    // hot: true,
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      symlinks: false,
    },
    module: {
      rules,
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    plugins: [
      new ReactRefreshPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
      publicPath: '/components',
    },
  });

  app.use(WebpackDevMiddleware(compiler, { publicPath: '/components' }));
  app.use(WebpackHotMiddleware(compiler));
};
