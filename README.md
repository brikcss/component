# Brikcss Component

> A scaffolding / starter repo for new [brikcss](https://github.com/brikcss/) components. Follow these steps to set up a new component.

[![npm (scoped)](https://img.shields.io/npm/v/@brikcss/component.svg?style=flat-square)](https://www.npmjs.com/package/@brikcss/component
) [![npm (scoped)](https://img.shields.io/npm/dm/@brikcss/component.svg?style=flat-square)](https://www.npmjs.com/package/@brikcss/component
) [![Travis branch](https://img.shields.io/travis/rust-lang/rust/master.svg?style=flat-square&label=master)](https://github.com/brikcss/component/tree/master
) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/
) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release
) [![npm](https://img.shields.io/npm/l/express.svg?style=flat-square)](https://choosealicense.com/licenses/mit/) [![Greenkeeper badge](https://badges.greenkeeper.io/brikcss/component.svg)](https://greenkeeper.io/)

<!-- MarkdownTOC -->

1. [Creating a new component](#creating-a-new-component)
	1. [Configure the component](#configure-the-component)
	1. [Build the component](#build-the-component)
	1. [Set up the new component repo](#set-up-the-new-component-repo)
	1. [Set up the automated release](#set-up-the-automated-release)

<!-- /MarkdownTOC -->

<a name="creating-a-new-component"></a>
## Creating a new component

- [ ] Clone [this repo](https://github.com/brikcss/component).
- [ ] [Configure the component](#configure-the-component).
- [ ] Install NPM packages with `npm install`.
- [ ] [Build the component](#build-the-component) for your first commit / publish.
- [ ] [Set up the new component repo](#set-up-the-new-component-repo).
- [ ] _(optional)__ To publish your first release at `v0.0.1` (as opposed to `v1.0.0`, which is what the automated release does by default):
	- [ ] Update the `version` field in `package.json` to `0.0.1` (or the version you wish to start at).
	- [ ] Publish your first release manually:
		```bash
		npm publish --tag=dev --access=public
		```
	- [ ] Update `version` in `package.json` back to `0.0.0-development`.
	- [ ] Delete all git tags (which come from the upstream / scaffold component repo).
		```bash
		git tag | xargs git tag -d
		```
	- [ ] Create a git tag for `0.0.1` (or whatever version you started at) and push it (this is so semantic-release is able to recognize where you're at):
		```bash
		# Create the tag.
		git tag v<version> <commit hash>
		# Push it to remote origin.
		git push --tags origin master
		```
- [ ] [Set up the automated release](#set-up-the-automated-release).

<a name="configure-the-component"></a>
### Configure the component

- [ ] `brikcss.config.js`: This sets up JS and SASS bundle compiling. See the example `brikcss.config.js` for details.
- [ ] `.browsersync.js`:
	- [ ] `files` property to watch build files.
	- [ ] `server` property to set the correct `baseDir` and `index` values.
	- [ ] Any other browsersync settings as desired.
- [ ] `.gitignore`.
- [ ] `.travis.yml` (scripts fields).
- [ ] `package.json`:
	- [ ] All fields with "component" to the new component name.
	- [ ] `description`.
	- [ ] `keywords`.
	- [ ] `main` and `module` with the correct entry files.
	- [ ] `files` with all files necessary for a release.
	- [ ] `scripts`:
		- [ ] `prod:clean` paths (and possibly add `mkdirp` to recreate `dist` dirs?).
		- [ ] `js:watch` and `js:lint` paths.
		- [ ] `sass:watch` and `sass:lint` paths.
		- [ ] If the component will have `dist` files, or if there are any tasks you want the release process to run prior to publishing, add the following NPM script to `package.json`:
			```js
			{
				// `prepublisOnly` runs right before `semantic-release` runs `npm publish`.
				"prepublishOnly": "npm run prod"
			}
			```
		- [ ] If you have `src` files that you wish to also place in `dist`:
			- [ ] Add the following NPM script:
				```js
				{
					"sass:dist": "ln -sf ../src/sass/ ./dist/sass",
				}
				```
			- [ ] Make sure to add this task to the `prod` task.
	- [ ] `devDependencies`.
- [ ] `README.md`:
	- [ ] Update shields to show data for the new component.
	- [ ] Update the rest of `README.md` as desired.
- [ ] `webpack.config.js` to ensure it compiles the correct JS files / bundles.
- [ ] `sass.config.js`: This configures SASS "bundles", similar to how webpack process JS bundles. Example:
	```js
	// Each bundle tells the SASS build task:
	// 	1) All files (files) belonging to a SASS entry file (entry). Defaults the entry file.
	// 	2) Where to save the compiled file (output).
	// 	3) Which environments (envs) to compile for (i.e., minification?). Defaults to ['dev', 'prod'].
	module.exports = {
		dist: {
			entry: 'src/sass/_flipper-init.scss',
			output: 'dist/css/flipper-vanilla.css',
			files: ['src/sass/*.scss'],
			envs: ['dev', 'prod']
		},
		examples: {
			entry: 'examples/example.scss',
			output: 'examples/flipper-sass.css',
			files: ['src/sass/*.scss', 'examples/example.scss'],
			envs: ['dev']
		}
	};
	```

<a name="build-the-component"></a>
### Build the component

The directory structure should be as follows:

- `src`: Original source code.
- `dist`: Files for distribution (if any).
- `examples`: Code or test examples.
- `docs`: Documentation.
- `tests`: UI and unit tests.
- `lib`: Helper scripts (i.e., NPM scripts or git hooks).

<a name="set-up-the-new-component-repo"></a>
### Set up the new component repo

- [ ] Create a new repo in GitHub for the new component.
- [ ] Configure remote tracking as follows:
	```bash
	# IMPORTANT: Set new master branch as upstream (not remote).
	# Otherwise commits will go to the component scaffold repo.
	# Setting as upstream also allows you to stay in sync with component scaffold repo.
	git remote rename origin upstream

	# Create a new local master branch based on upstream/master.
	git branch -m master master-upstream # Rename local upstream/master first.
	git checkout -b master master-upstream # Create new local master.
	git branch -d master-upstream # Delete local master-upstream.

	# Add the new GitHub repo as the remote origin.
	git remote add origin <github repo url>

	# Run this the first time you push changes.
	# This will set up origin/master to track local master and push.
	git push -u origin master
	```
- [ ] When you run `git remote -v`, the `origin` should track the new GitHub repo and the `upstream` should track this component scaffold repo.
- [ ] In the future, to stay in sync with this component `upstream` repo:
	```bash
	git merge upstream/master
	```

<a name="set-up-the-automated-release"></a>
### Set up the automated release

- [ ] Set up [`semantic-release`](https://github.com/semantic-release/semantic-release) by running `semantic-release-cli setup`. _**Important**: Make sure to not overwrite the `.travis.yml` file we already have._
- [ ] After it is published, create a `dev` channel / dist-tag:
	```bash
	npm dist-tag add @brikcss/<component>@<version> dev -d
	```
