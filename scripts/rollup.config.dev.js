import baseConfig from './rollup.config.base.js'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const devOutput = baseConfig.output.find((o) => o.format === 'umd')

export default {
  ...baseConfig,
  output: {
    ...devOutput,
    sourcemap: true
  },
  plugins: [
    ...baseConfig.plugins,
    serve({
      port: 8080,
      contentBase: ['dist', 'examples/browser'],
      openPage: '/index.html'
    }),
    livereload({ watch: ['dist', 'examples/browser'] })
  ]
}
