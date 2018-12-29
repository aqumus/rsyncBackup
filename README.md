<div align="center">
<h2>Rsync Backup GUI</h2>
</div>

<hr>
<br>

<div align="center">

![Rsync Backup GUI Demo](https://media.giphy.com/media/12QuKZFWiR5GDcWM5F/giphy.gif)

</div>

## Introduction

This is GUI (made from [electron.js](https://electronjs.org/))for rsync backup

## Dependencies

This requires [**rsync**](https://rsync.samba.org/)
For Windows: [This requires WSL with any one of the linux image](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
For Linux and Mac OS - this should work out of box as rsync is installed mostly

## Todo

- [ ] Fix issue with destination as USB drive or network drive
- [ ] Build linux and Mac OS target packages and test basic functionality
- [ ] Test destination as a separate/different server host (ssh functionalit)
- [ ] Add profile/backup template functionality
- [ ] Add few advanced options like excluding files
- [ ] Add features to set options for periodic auto backup

#### This Project has been boostrapped from [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

## Install

- **Install [**yarn**](https://yarnpkg.com/lang/en/docs/install)
  **

First, clone the repo via git and checkout master branch:

And then install the dependencies with yarn.

```bash
$ yarn
```

## Run

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
$ yarn dev
```

If you don't need autofocus when your files was changed, then run `dev` with env `START_MINIMIZED=true`:

```bash
$ START_MINIMIZED=true yarn dev
```

## Packaging

To package apps for the local platform:

```bash
$ yarn package
```

To package apps for all platforms:

First, refer to the [Multi Platform Build docs](https://www.electron.build/multi-platform-build) for dependencies.

Then,

```bash
$ yarn package-all
```

To package apps with options:

```bash
$ yarn package --[option]
```

To run End-to-End Test

```bash
$ yarn build-e2e
$ yarn test-e2e

# Running e2e tests in a minimized window
$ START_MINIMIZED=true yarn build-e2e
$ yarn test-e2e
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:

```bash
DEBUG_PROD=true yarn package
```

## CSS Modules

This boilerplate is configured to use [css-modules](https://github.com/css-modules/css-modules) out of the box.

All `.css` file extensions will use css-modules unless it has `.global.css`.

If you need global styles, stylesheets with `.global.css` will not go through the
css-modules loader. e.g. `app.global.css`

If you want to import global css libraries (like `bootstrap`), you can just write the following code in `.global.css`:

```css
@import '~bootstrap/dist/css/bootstrap.css';
```

## SASS support

If you want to use Sass in your app, you only need to import `.sass` files instead of `.css` once:

```js
import './app.global.scss';
```

## Static Type Checking

This project comes with Flow support out of the box! You can annotate your code with types, [get Flow errors as ESLint errors](https://github.com/amilajack/eslint-plugin-flowtype-errors), and get [type errors during runtime](https://github.com/codemix/flow-runtime) during development. Types are completely optional.

## Dispatching redux actions from main process

See [#118](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/118) and [#108](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/108)

## Maintainers

- [Aquib Vadsaria](https://github.com/aqumus)

## License

MIT © [Rsync Backup GUI]
