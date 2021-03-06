/**
 * .browsersync.js
 * ---------------
 * @author brikcss
 * @homepage https://github.com/brikcss
 * @description Configuration object for [BrowserSync](https://www.browsersync.io/).
 * ---------------------------------------------------------------------
 */


module.exports = {
	ui: {
		port: 3001,
		weinre: {
			port: 8080
		}
	},
	files: [],
	watchTask: true,
	watchEvents: ['add', 'change', 'unlink'],
	watchOptions: {
		ignoreInitial: true
	}, // Options passed to chokidar.
	server: {
		baseDir: '.',
		index: 'examples/vanilla/index.html',
		// directory: true,
		// routes: {
		// 	'/dist': 'dist',
		// 	'/examples': 'examples'
		// },
	},
	proxy: false,
	port: 3000,
	serveStatic: [],
	ghostMode: {
		clicks: false,
		scroll: false,
		forms: {
			submit: false,
			inputs: false,
			toggles: false
		}
	},
	logLevel: 'info',
	logPrefix: 'BS',
	logConnections: false,
	logFileChanges: true,
	logSnippet: true,
	rewriteRules: [],
	open: true,
	browser: 'default',
	cors: false,
	xip: false,
	hostnameSuffix: false,
	reloadOnRestart: true,
	notify: {
		styles: {
			top: 'auto',
			bottom: 0,
			padding: '5px 15px',
			'border-radius': '6px 0 0 0',
			'background-color': 'rgba(0, 0, 0, .6)'
		}
	},
	scrollProportionally: false,
	scrollThrottle: 100,
	scrollRestoreTechnique: 'window.name',
	scrollElements: [],
	scrollElementMapping: [],
	reloadDelay: 0,
	reloadDebounce: 0,
	reloadThrottle: 0,
	plugins: [],
	injectChanges: true,
	startPath: null,
	minify: false,
	host: null,
	localOnly: false,
	codeSync: true,
	timestamps: true,
	// clientEvents: [
	// 	scroll,
	// 	scroll: element,
	// 	input: text,
	// 	input: toggles,
	// 	form: submit,
	// 	form: reset,
	// 	click
	// ],
	// socket: {
	// 	socketIoOptions: {
	// 		log: false
	// 	},
	// 	socketIoClientConfig: {
	// 		reconnectionAttempts: 50
	// 	},
	// 	path: /browser-sync/socket.io,
	// 	clientPath: /browser-sync,
	// 	namespace: /browser-sync,
	// 	clients: {
	// 		heartbeatTimeout: 5000
	// 	}
	// },
	// tagNames: {
	// 	less: link,
	// 	scss: link,
	// 	css: link,
	// 	jpg: img,
	// 	jpeg: img,
	// 	png: img,
	// 	svg: img,
	// 	gif: img,
	// 	js: script
	// }
	// middleware: [
	// 	function(req, res, next) {}
	// ],
	// https: false,
	// browser: ['google-chrome'],
};
