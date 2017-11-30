/** ------------------------------------------------------------------------------------------------
 *  sass-compile.js
 *  ---------------
 *  Compiles SASS for a brik component.
 *  @author  brikcss
 *  @todo: option to not have main.scss entry file with sass, since `files` option should suffice.
 ** --------------------------------------------------------------------------------------------- */
/* eslint-disable no-console */


// ----------------------------------
// Set up environment & dependencies.
//
const brik = require('app-root-path').require('./brikcss.config');
brik._cache = {};

// Validate brik required properties.
if (!brik.name) {
	throw new Error('`brikcss.config.js` must have a `brik.name` property.');
}
if (!brik.bundles) {
	throw new Error('No `bundles` exist in `brikcss.config.js`.');
}
if (!brik.bundles.sass) {
	throw new Error('No `sass` property exists in `brikcss.config.js`, so no SASS bundles will be compiled.'); // eslint-disable-line
}

// Cli arguments.
const args = require('minimist')(process.argv.slice(2));
args.bundles = args.bundles || args.b; // --bundles|-b: bundle(s) to run.
args.file = args.file || args.f; // --file|-f: file to run.

// Dependencies.
const sass = require('node-sass');
const postcss = require('postcss');
const fs = require('fs-extra');
const path = require('path-extra');
const magicImporter = require('node-sass-magic-importer');
const minimatch = require('minimatch');


// -------------------------------
// Determine which bundles to run.
// ---
// The bundles that run are determined (in order of priority) by:
// 	1) --file=<path> (-f): This runs the bundle(s) that file belongs to. Helpful for watch tasks.
// 	2) --bundles=<list> (-b): This runs the bundle(s) listed (comma separated).
// 	3) If neither args.file or args.bundles exist, all SASS bundles will run.
//
let bundlesToRun = [];
if (args.bundles) {
	bundlesToRun = args.bundles.split(',');
} else if (args.file) {
	bundlesToRun = getBundlesFromFile(args.file);
} else {
	bundlesToRun = Object.keys(brik.bundles.sass);
	bundlesToRun = bundlesToRun.filter((bundleName) => bundleName !== 'globals');
}


// --------------------
// Process each bundle.
//
// Start a timer.
// let startTime = Date.now();
let promises = [];
bundlesToRun.forEach((bundleName) => {
	let bundle = brik.bundles.sass[bundleName];
	if (!bundle) {
		console.log(`[SASS] Skipped \`${bundle}\` bundle, it doesn't exist.`);
		return false;
	}

	// Start timer.
	bundle.start = Date.now();

	// Merge `bundles.globals` to this bundle.
	bundle = Object.assign({name: bundleName}, brik.bundles.sass.globals, bundle);

	// Set default `output` if it doesn't exist.
	if (bundle.output === undefined) {
		bundle.output = {
			path: './dist',
			filename: `${brik.name}-[name].js`
		};
	}

	// If `brik.variants` exists and no `bundle.variants` are configured, run all variants.
	if (bundle.variants === undefined && typeof brik.variants === 'object') {
		bundle.variants = Object.keys(brik.variants);
	}

	// Compile each variant. @todo: Move this loop to the `compileBundle()` function?
	bundle.variants.forEach((variant) => {
		promises.push(compileBundle(bundle, brik.variants[variant]));
	});
});


// ----------------------
// Complete all promises.
//
Promise.all(promises)
	.then((results) => {
		let compilePromises = [];
		results.forEach((promise) => compilePromises = compilePromises.concat(promise));
		return Promise.all(compilePromises);
	// }).then(() => {
	// 	if (promises.length > 1) {
	// 		let endTime = Date.now();
	// 		let duration = formatDuration(endTime - startTime);
	// 		log(`[SASS] Compiled all SASS bundles in ${duration}.`);
	// 	}
	}).catch((error) => console.log('[SASS]', error));


/**
 * Compile a SASS bundle to CSS.
 * @param   {object}  bundle  Configuration object.
 * @return  {promise}
 */
function compileBundle(bundle = {}, options = {}) {
	let compilePromises = [];
	let output = bundle.output;

	// If no entry file exists (preferred), create temp entry file to import files.
	if (!bundle.entry) {
		let data = '';
		bundle.entry = `./.temp/sass-${bundle.name}.scss`;
		bundle.files.forEach((glob) => {
			data += '@import "' + glob + '"; ';
		});
		fs.outputFileSync(bundle.entry, data);
	}

	// Change output path to '.min' when minify option is true.
	if (options.minify) {
		output = path.fileNameWithPostfix(output, '.min');
	}

	return new Promise((resolve, reject) => {
		// Sass always compiles for dev, then postcss handles the production build.
		return sass.render({
			file: bundle.entry,
			indentType: 'tab',
			indentWidth: 1,
			outputStyle: options.minify ? 'compressed' : 'expanded',
			sourceComments: options.sourcemap,
			sourceMap: options.sourcemap,
			importer: magicImporter({
				packageKeys: ['main.sass'],
				packagePrefix: '~'
			}),
			outFile: output + '.map'
		}, (error, result) => {
			if (error) {
				console.log('[SASS]', error);
				reject(error);
			}

			// Track duration of just sass compilation.
			// bundle.sassDuration = formatDuration(Date.now() - bundle.start);

			// Set up plugins.
			let plugins = [
				require('autoprefixer')({cascade: false}),
				require('postcss-reporter')({clearReportedMessages: true})
			];

			// Run postcss.
			return postcss(plugins)
				.process(result.css, {
					from: bundle.entry,
					to: output,
					map: options.sourcemap ? {
						prev: result.map.toString(),
						inline: true
					} : false
				})
				.then((result) => {
					const pkg = require('../../package.json');
					let banner = [
						pkg.name + ' v' + pkg.version,
						'@filename ' + path.basename(output),
						'@author ' + pkg.author,
						'@homepage ' + pkg.homepage,
						'@license ' + pkg.license,
						'@description ' + pkg.description,
					];

					// Save sourcemap.
					if (options.sourcemap && result.map) {
						compilePromises.push(fs.outputFile(output + '.map', result.map));
					}

					// Output file.
					let css = '';
					if (options.minify) {
						css = '/*! ' + banner.join(' | ') + ' */\n' + require('csso').minify(result.css).css;
					} else {
						css = ['/*!\n * ' + banner.join('\n * ') + '\n */', result.css].join('\n\n\n');
					}
					compilePromises.push(fs.outputFile(output, css));

					return Promise.all(compilePromises);
				}).then((result) => {
					// Log time.
					bundle.stop = Date.now();
					bundle.duration = formatDuration(bundle.stop - bundle.start);
					console.log(`[SASS] Compiled \`${bundle.name}\` bundle to \`${output}\` (${bundle.duration}).`);

					resolve(result);
					return result;
				}).catch((error) => {
					console.log('[SASS]', error);
					reject(error);
				});
		});
	});
}


/**
 *  Given a filepath, returns bundle names that filepath belongs to. Especially useful for watch
 *  tasks, so only bundle(s) that change are compiled.
 *
 *  @param   {string}  filepath  File path to check.
 *  @return  {array}  Bundle(s) this file belongs to.
 */
function getBundlesFromFile(filepath) {
	const bundles = brik.bundles.sass;
	let files = {};
	let bundlesToRun = [];
	bundles.globals = bundles.globals || {};
	bundles.globals.files = bundles.globals.files || [];
	Object.keys(brik.bundles.sass).forEach((bundleName) => {
		// Don't process the globals property.
		if (bundleName === 'globals') {
			return;
		}
		// Concat global.files with each bundle.files.
		files[bundleName] = bundles.globals.files.concat(bundles[bundleName].files);
		if (bundles[bundleName].entry) {
			files[bundleName].push(bundles[bundleName].entry);
		}
		// Check if file matches.
		if (minimatch.match(files[bundleName], filepath).length) {
			bundlesToRun.push(bundleName);
		}
	});
	// Return bundles that match.
	return bundlesToRun;
}


/**
 * Format duration to show as 'ms' or 's'.
 * @param   {number}  duration  Number of milliseconds.
 * @return  {string}  String formatted as number + 'ms' or 's'.
 */
function formatDuration(duration) {
	return duration = duration > 999 ? (duration / 1000) + 's' : duration + 'ms';
}
