# Brikcss Component

> A scaffolding / starter repo for new [brikcss](https://github.com/brikcss/) components. Follow these steps to set up a new component.

[![npm (scoped)](https://img.shields.io/npm/v/@brikcss/component.svg?style=flat-square)](https://www.npmjs.com/package/@brikcss/component
) [![npm (scoped)](https://img.shields.io/npm/dm/@brikcss/component.svg?style=flat-square)](https://www.npmjs.com/package/@brikcss/component
) [![Travis branch](https://img.shields.io/travis/rust-lang/rust/master.svg?style=flat-square&label=master)](https://github.com/brikcss/component/tree/master
) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/
) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release
) [![npm](https://img.shields.io/npm/l/express.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)

<!-- MarkdownTOC -->

1. [Set up the new component repo & test](#set-up-the-new-component-repo-and-test)
1. [Update configs / root files](#update-configs--root-files)
1. [Set up the automated release](#set-up-the-automated-release)
1. [Build the component](#build-the-component)

<!-- /MarkdownTOC -->

<a name="set-up-the-new-component-repo-and-test"></a>
## Set up the new component repo & test

- [ ] Clone this repo.
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

<a name="update-configs--root-files"></a>
## Update configs / root files

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
		- [ ] `sass:watch` and `sass:lint` and `sass:dist` paths.
		- [ ] If the component will have `dist` files, or if there are any tasks you want the release process to run prior to publishing, add the following NPM script to `package.json`:
			```js
			{
				"prepublishOnly": "npm run prod"
			}
			```
	- [ ] `devDependencies`.
- [ ] `README.md`:
	- [ ] Update shields to show data for the new component.
	- [ ] Update the rest of `README.md` as desired.
- [ ] `webpack.config.js` to ensure it compiles the correct files / bundles.

<a name="set-up-the-automated-release"></a>
## Set up the automated release

- [ ] Install NPM packages with `npm install`.
- [ ] _(Optional)_: [semantic-release](https://github.com/semantic-release/semantic-release) creates the first release at version `1.0.0`. If you want to start at a different version (such as `0.0.1`), do the following:
	- [ ] Change the `version` field in `package.json` to `0.0.1` (or the version you wish to start at).
	- [ ] Publish your first release manually:
		```bash
		npm publish --tag=dev --access=public
		```
	- [ ] Change `version` in `package.json` back to `0.0.0-development`.
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
- [ ] Set up [`semantic-release`](https://github.com/semantic-release/semantic-release) by running `semantic-release-cli setup`. _**Important**: Make sure to not overwrite the `.travis.yml` file we already have._
- [ ] After it is published, create a `dev` channel / dist-tag:
	```bash
	npm dist-tag add @brikcss/<component>@<version> dev -d
	```

<a name="build-the-component"></a>
## Build the component

The directory structure should be as follows:

- `src`: Original source code.
- `dist`: Files for distribution (if any).
- `examples`: Code or test examples.
- `docs`: Documentation.
- `tests`: UI and unit tests.
- `lib`: Helper scripts (i.e., NPM scripts or git hooks).
