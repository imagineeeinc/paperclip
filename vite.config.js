var { VitePWA } = require('vite-plugin-pwa')
var manifest = require('./src/manifest.json')
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
        app: resolve(__dirname, 'src/app/index.html'),
        share: resolve(__dirname, 'src/share/index.html'),
        404: resolve(__dirname, 'src/404.html'),
        signin: resolve(__dirname, 'src/signin/index.html'),
        downloads: resolve(__dirname, 'src/downloads/index.html'),
      }
    }
  },
	plugins: [
    VitePWA({
			registerType: 'autoUpdate',
      manifest: process.env.DEPO == 'vercel' ? {...manifest, start_url: 'https://paper-clip.web.app/app/', scope: 'https://paper-clip.web.app/'} : manifest ,
      workbox: {
        cleanupOutdatedCaches: false,
				globPatterns: ["**/*.{js,css,html,png,svg,jpg,jpeg,gif,json,woff,woff2,ttf,eot}"],
      }
    })/* ,
    ViteFaviconsPlugin({
      logo: './src/img/paperclip.png',
      inject: false,
      favicons: {
        ...manifest,
        icons: {android: true,
          appleIcon: true,
          appleStartup: true,
          favicons: true,
          windows: true,
          yandex: true,
        }
      }
    }) */
  ]
}
