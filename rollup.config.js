/**
 * Plugins
 */
import run from 'rollup-plugin-run';
import babel from 'rollup-plugin-babel';
import sourceamps from 'rollup-plugin-sourcemaps';

import packageJSON from './package.json';

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: packageJSON.main,
        format: 'cjs',
        sourcemap: true,
      },
      // {
      //     file: packageJSON.module,
      //     format: 'esm',
      // },
      // {
      //     name: 'index',
      //     file: packageJSON.browser,
      //     format: 'umd',
      // },
    ],
    plugins: [
      run(),
      babel({
        exclude: 'node_modules/**',
      }),
      sourceamps()
    ],
  },
];
