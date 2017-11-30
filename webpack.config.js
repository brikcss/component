/**
 * webpack.config.js
 * -----------------
 * @author brikcss
 * @homepage https://github.com/brikcss
 * @description Configuration for [webpack](https://webpack.js.org).
 * ---------------------------------------------------------------------
 */

// -------------------
// Set up environment.
//
const webpack = require("webpack");
const path = require("path-extra");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const brik = require("./brikcss.config.js");
const configs = [];

// Make sure required properties exist.
if (!brik.name) {
	throw new Error("`brikcss.config.js` must have a `brik.name` property.");
}
if (!brik.bundles) {
	throw new Error("No `bundles` exist in `brikcss.config.js`.");
}
if (!brik.bundles.js) {
	throw new Error(
		"No `js` property exists in `brikcss.config.js`, so no js bundles will be compiled."
	); // eslint-disable-line
}

// --------------------------------------
// Set up configurations for each flavor.
//
Object.keys(brik.bundles.js).forEach(bundleName => {
	// Don't process `globals` as a bundle.
	if (bundleName === "globals") {
		return;
	}

	// Create bundle.
	let bundle = Object.assign(
		{},
		brik.bundles.js.globals,
		brik.bundles.js[bundleName]
	);

	// Set default `output` if it doesn't exist.
	if (bundle.output === undefined) {
		bundle.output = {
			path: "./dist",
			filename: `${brik.name}-[name].js`
		};
	}

	// If `brik.variants` exists and no `bundle.variants` are configured, run all variants.
	if (bundle.variants === undefined && typeof brik.variants === "object") {
		bundle.variants = Object.keys(brik.variants);
	}

	// Create config for each bundle environment.
	if (bundle.variants) {
		bundle.variants.forEach(variantName => {
			// Make sure variant exists.
			if (!brik.variants || !brik.variants[variantName]) {
				throw new Error(
					`\`brikcss.config.js\` does not have \`${
						variantName
					}\` set up as a \`variant\`.`
				);
			}
			const options = brik.variants[variantName];
			options.name = bundleName;
			configs.push(createConfig(bundle, options));
		});
		// Or create a single bundle if no environments are configured.
	} else {
		configs.push(createConfig(bundle, { name: bundleName }));
	}
});

/**
 *  Create config object for webpack.
 *
 *  @param   {object}  bundle  Bundle options object.
 *  @return  {object}  Webpack configuration object.
 */
function createConfig(bundle = {}, options = {}) {
	const pkg = require("./package.json");

	// Make sure bundle has an entry and output.
	if (!bundle.entry || !bundle.output) {
		throw new Error(
			"The bundle object must have both an `entry` and `output` property. See https://webpack.js.org/ for documentation."
		);
	}
	if (
		typeof bundle.output === "object" &&
		(!bundle.output.filename || !bundle.output.path)
	) {
		throw new Error(
			"The `bundle.output` object must have both a `filename` and `path` property. See https://webpack.js.org/ for documentation."
		);
	}

	// Set up default config and merge with bundle.
	const config = Object.assign(
		{
			devtool:
				options.sourcemap !== undefined
					? options.sourcemap ? "source-map" : false
					: options.minify ? false : "source-map",
			resolve: {
				alias: {
					src: path.resolve(__dirname, "src")
				}
			}
		},
		bundle
	);

	// Set up banner.
	let banner = [
		pkg.name + " v" + pkg.version,
		"@filename <filename>",
		"@author " + pkg.author,
		"@homepage " + pkg.homepage,
		"@license " + pkg.license,
		"@description " + pkg.description
	];

	// Entry file(s).
	config.entry = {};
	config.entry[options.name] = bundle.entry;

	// Output path & filename.
	config.output = {};
	// Convert bundle.output string to webpack object.
	if (typeof bundle.output === "string") {
		config.output.filename = path.basename(bundle.output);
		config.output.path = path.resolve(path.dirname(bundle.output));
	}
	// Add .min file extension when appropriate.
	if (options.minify) {
		config.output.filename = path.fileNameWithPostfix(
			config.output.filename,
			".min"
		);
	}
	// By default, create a Universal Module Definition (UMD) for the vanilla bundle.
	if (bundle.output.library === undefined && options.name === "vanilla") {
		config.output.library = brik.name;
		config.output.libraryTarget = "umd";
	}

	// Module rules.
	config.module = {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: [
					{
						loader: "babel-loader"
						// options: {
						// 	preset: ['env']
						// }
						// }, {
						// 	loader: 'eslint-loader',
						// options: {}
					}
				]
			}
		]
		// script-loader?
		// mocha-loader? (testing)
		// coverjs-loader? (coverage)
	};

	// Plugins.
	config.plugins = [
		new webpack.BannerPlugin(
			banner
				.join(options.minify ? " | " : "\n")
				.replace("<filename>", config.output.filename)
		)
		// CommonsChunkPlugin
		// BannerPlugin
		// HotModuleReplacementPlugin
		// HtmlWebpackPlugin
		// UglifyjsWebpackPlugin
	];
	if (options.minify) {
		config.plugins.push(
			// BabelMinifyWebpackPlugin
			new UglifyJsPlugin({
				parallel: {
					cache: true,
					workers: 2
				},
				uglifyOptions: {
					ecma: 6
				},
				sourceMap: options.sourcemap
			})
		);
	}

	// Get rid of non-webpack properties that were merged earlier from bundle.globals. Webpack
	// throws an error for any unrecognized properties.
	// const webpackProps = ["amd", "bail", "cache", "context", "dependencies", "devServer", "devtool", "entry", "externals", "loader", "module", "name", "node", "output", "parallelism", "performance", "plugins", "profile", "recordsInputPath", "recordsOutputPath", "recordsPath", "resolve", "resolveLoader", "stats", "target", "watch", "watchOptions"];
	delete config.variants;

	// Return the config object.
	return config;
}

module.exports = configs.length === 1 ? configs[0] : configs;
