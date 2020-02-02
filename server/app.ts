import express from 'express';
import webpack from './webpack';
import webpackComponents from './webpack.components';

const app: express.Application = express();

app.use(webpack);
webpackComponents(app);

const html = () => `<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello React!</title>
    </head>
    <body>
        <div id="example"></div>

        <!-- Main -->
        <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
        <script src="/components/main.js"></script>
        <script src="/public/main.js"></script>
    </body>
</html>
`;

app.get('/', (__, res) => {
  res.send(html());
});

export default app;
