const { resolve } = require('path')
module.exports = {
	base: '/',
	title: 'Paperclip',
	description: 'A simple notepad app',
	root: './src',
	dest: './dist',
	build: {
		outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        app: resolve(__dirname, 'src/app/index.html')
      }
    }
  }
}