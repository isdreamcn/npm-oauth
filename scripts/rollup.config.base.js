import path from 'path'
import fs from 'fs-extra'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import eslint from '@rollup/plugin-eslint'
import typescript from '@rollup/plugin-typescript'
import { babel } from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import clear from 'rollup-plugin-clear'

const { name, version, author } = fs.readJsonSync('package.json')

export const pkgName = 'isdream-oauth'

const banner = `/*!
 * ${name} v${version}
 * (c) 2025 ${author}
 * @license MIT.
 */`

const outputBase = { name: 'isdreamOAuth', banner }

export default {
  input: 'src/index.ts',
  external: ['axios'],
  output: [
    {
      file: `dist/${pkgName}.js`,
      format: 'umd',
      ...outputBase,
      globals: { axios: 'axios' }
    },
    {
      file: `dist/${pkgName}.min.js`,
      format: 'umd',
      ...outputBase,
      globals: { axios: 'axios' },
      plugins: [terser()]
    },
    { file: `dist/${pkgName}.cjs.js`, format: 'cjs', banner },
    {
      file: `dist/${pkgName}.cjs.min.js`,
      format: 'cjs',
      banner,
      plugins: [terser()]
    },
    { file: `dist/${pkgName}.esm.js`, format: 'es', banner },
    {
      file: `dist/${pkgName}.esm.min.js`,
      format: 'es',
      banner,
      plugins: [terser()]
    }
  ],
  plugins: [
    clear({ targets: ['dist', 'publish'] }),
    alias({
      entries: [{ find: '@', replacement: path.resolve('src') }]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    eslint({ throwOnError: true, include: ['src/**'] }),
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({ babelHelpers: 'bundled', extensions: ['.js', '.ts'] })
  ]
}
