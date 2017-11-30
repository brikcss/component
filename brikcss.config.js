/** ------------------------------------------------------------------------------------------------
 *  brikcss.config.js
 *  -----------------
 *  Configuration for brikcss component.
 ** --------------------------------------------------------------------------------------------- */

const isProd =
	process.env.NODE_ENV === "prod" || process.env.NODE_ENV === "production";
module.exports = {
	name: "component",
	// Variants: variants to run for each bundle.
	variants: {
		dev: {
			minify: false,
			sourcemap: true
		},
		prod: {
			minify: true,
			sourcemap: false
		}
	},
	// Bundles.
	bundles: {
		// SASS bundles.
		// -------------
		// `bundle.files`: (required) SASS files (accepts globs) included in bundle.
		// `bundle.output`: Similar to webpack.output.
		// `bundle.entry`: Entry file. Not required. `files` is preferred.
		// `bundle.variants`: Variants to run from `brik.variants`.
		// `bundles[name].globals`: Merged into each bundle. Accepts any `bundle.*` property.
		sass: {
			globals: {
				variants: isProd ? ["dev", "prod"] : ["dev"]
			},
			dist: {
				entry: "src/sample-entry.scss",
				files: ["src/sample1.scss"],
				output: ".dist/dist.css"
			},
			examples: {
				files: ["src/sample1.scss", "src/sample2.scss"],
				output: ".dist/example.css",
				variants: ["dev"] // Only compiles in `dev` environment.
			}
		},
		// JS bundles.
		// -----------
		// Passes all options to `webpack`, except for `bundle.variants`, which is used to
		// 		process multiple bundle configurations with webpack at once.
		// `bundle.entry`: (required) webpack.entry.
		// `bundle.output`: webpack.output. If not configured, default is:
		// 		{filename: `${brik.name}-[name].js`, path: './dist'} where '[name]' is bundle name.
		// `bundle.variants`: Array of bundle variants to create from `brik.variants`.
		// `bundles[name].globals`: Merged into each bundle. Accepts any `bundle.*` property.
		js: {
			globals: {
				output: ".dist/sample-[name].js",
				variants: isProd ? ["dev", "prod"] : ["dev"]
			},
			vanilla: {
				entry: "src/sample-entry1.js"
				// output: '.dist/sample-[name].js'
			},
			angularjs: {
				entry: "src/sample-entry2.js",
				// output: '.dist/sample-[name].js',
				variants: ["dev"]
			}
		}
	}
};
