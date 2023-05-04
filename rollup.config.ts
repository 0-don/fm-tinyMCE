import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { unlinkSync } from 'fs';
import { join, resolve } from 'path';
import { RollupOptions } from 'rollup';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';
import { htmlInsert } from './src/rollup-plugin/rollup-plugin-html-insert.js';

const rollupOption: RollupOptions = {
  input: 'src/index.ts',
  plugins: [
    swc(),
    htmlInsert(),
    nodeResolve(),
    commonjs(),
    postcss({
      include: '**/skin.css',
      inject: true,
      extract: false,
    }),
    postcss({
      include: '**/content.css',
      inject: true,
      extract: false,
    }),
    terser({
      output: { comments: false },
    }),
    {
      name: 'clean_up',
      closeBundle: () => {
        try {
          unlinkSync(join(resolve(), 'dist', 'index.js'));
        } catch (_) {}
      },
    },
  ],
  output: {
    dir: 'dist',
    format: 'umd',
    inlineDynamicImports: true,
    experimentalMinChunkSize: 10000,
  },
};

export default rollupOption;
