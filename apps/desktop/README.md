# Umami Desktop

Umami Desktop is an Electron-based wallet.

## Available Scripts

In the project directory, you can run:

### `pnpm dev`

Runs the app in the development mode.\
Open [http://127.0.0.1:3000](http://127.0.0.1:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `pnpm test`

Launches the test runner in the interactive watch mode.\
We use [jest](https://jestjs.io/) as the test runner.

### `pnpm test:e2e`

This will run the e2e tests for you. Please make sure that you have docker & docker-compose [installed](https://docs.docker.com/desktop/install/mac-install/).

Note: the test runner expects the server with the app running at localhost:3000. You can use the dev server (`pnpm dev`) for that.
On CI we build the app and serve the production build on the same port (check `.github/workflows/e2e.yaml` for details).

When you're working on a specific scenario, you can mark it with a `@focus` tag and use `pnpm test:e2e:focus` to run it exclusively.

### `pnpm build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `pnpm electron:start`

Runs the electron app in the development mode.
In order to get the dev tools work please make sure to set the `devTools` to `true` in the `webPreferences` in `public/electron.js`
Note: you still have to have your `pnpm dev` running in a separate terminal

### `pnpm electron:package:(mac|win|linux)`

Build electron app for desired platform (don't forget to run `pnpm build` before running this one)

For the mac build you'd need signing credentials & the certificate. Alongside that you need to obtain an [Apple app specific password](https://support.apple.com/en-gb/102654). The app will be signed automatically during the packaging process.

For Windows you need the USB dongle with the certificate. You package the app using `pnpm electron:package:win` and then run

```
signtool sign /tr http://timestamp.sectigo.com /td sha256 /fd sha256 /a '.\dist\<installer>.exe'
```

To make yourself a debugging build run `pnpm electron:package:mac:debug`. It will work only on your machine, but you'll be able to play around with it. For the same purpose you might find helpful enabling devTools in `public/electron.js` before running `pnpm build` and this command.

### `pnpm docs`

It will generate documentation in HTML and put it into the `docs` folder. Open `docs/index.html`
