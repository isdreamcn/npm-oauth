import fs from 'fs-extra'
import baseConfig, { pkgName } from './rollup.config.base.js'
import filesize from 'rollup-plugin-filesize'
import dts from 'rollup-plugin-dts'

const generatePackageJson = () => {
  const pkg = fs.readJsonSync('package.json')

  fs.outputJsonSync(
    'publish/package.json',
    {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      main: 'index.js',
      module: 'dist/isdream-oauth.esm.js',
      types: 'dist/isdream-oauth.d.ts',
      unpkg: 'dist/isdream-oauth.min.js',
      jsdelivr: 'dist/isdream-oauth.min.js',
      repository: {
        type: 'git',
        url: 'git+https://github.com/isdreamcn/npm-oauth.git'
      },
      keywords: ['isdream', 'oauth'],
      author: pkg.author,
      license: pkg.license,
      bugs: {
        url: 'https://github.com/isdreamcn/npm-oauth/issues'
      },
      homepage: 'https://github.com/isdreamcn/npm-oauth#readme',
      peerDependencies: pkg.peerDependencies,
      dependencies: pkg.dependencies
    },
    {
      spaces: 2
    }
  )
}

const generatePublish = () => ({
  name: 'generate-publish',
  writeBundle() {
    generatePackageJson()
    fs.copySync('dist', 'publish/dist')
    fs.copySync('index.js', 'publish/index.js')
    fs.copySync('LICENSE', 'publish/LICENSE')
    fs.copySync('README.md', 'publish/README.md')
  }
})

export default [
  {
    ...baseConfig,
    plugins: [...baseConfig.plugins, filesize(), generatePublish()]
  },
  {
    input: baseConfig.input,
    output: [{ file: `publish/dist/${pkgName}.d.ts`, format: 'es' }],
    plugins: [dts()]
  }
]
