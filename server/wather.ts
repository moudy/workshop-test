import path from 'path';
import sane from 'sane';

const componentsRoot = path.join(__dirname, '../src');

const watcher = sane(componentsRoot, { glob: ['**/*.tsx', '**/*.ts'] });
