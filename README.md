# Umami V2

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Initial setup

Just run `./bin/setup`. It'll create a git pre-push hook with all the necessary checks

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn test:tezos:integration`

Run the tests including Tezos integration tests.
The Tezos integration tests use real accounts on Ghotnet and Mainnet.
Therefore these may fail if an account has insufficient balances, a node is down, etc...

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `yarn electron start`

Runs the electron app in the development mode.
In order to get the dev tools work please make sure to set the `ENABLE_DEV_TOOLS` env variable to `true`

### `yarn electron:package:(mac|win|linux)`

Build electron app for desired platform (don't forget to run `yarn build` before running this one)

### `yarn storybook`

Start storybook (duh).

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
