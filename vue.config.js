const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  publicPath: '/',
  outputDir: 'dist', 
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'index.html',
      filename: 'index.html',
      title: 'Stats',
    },
    notFound: {
      entry: 'src/main.js',
      template: '404.html',
      filename: '404.html',
      title: '404 - Page Not Found',
    },
  },
})
