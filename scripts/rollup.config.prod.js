import baseConfig, { pkgName } from './rollup.config.base.js'
import filesize from 'rollup-plugin-filesize'
import dts from 'rollup-plugin-dts'

export default [
  {
    ...baseConfig,
    plugins: [...baseConfig.plugins, filesize()]
  },
  {
    input: baseConfig.input,
    output: [{ file: `dist/${pkgName}.d.ts`, format: 'es' }],
    plugins: [dts()]
  }
]
