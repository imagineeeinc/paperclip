var { VitePWA } = require('vite-plugin-pwa')
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
  },
	plugins: [
    VitePWA({
			registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: false,
				globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg,gif,json,woff,woff2,ttf,eot}"],
      }  
    })
  ]
}