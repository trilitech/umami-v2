# Umami V2

[Umami](https://umamiwallet.com) is a cryptocurrency wallet developed by [Trilitech](https://trili.tech/) to interact with the [Tezos
Blockchain](https://tezos.com/). It runs as a desktop electron-based app with multiple features:

- HD Wallet
- Multiple accounts management
- Multi-signature accounts
- Ledger support
- Google login
- NFT Gallery
- FA2 and FA1.2 token support
- DApp interaction
- Batch capability (combining Tez, FA2, and FA1.2 token transfers)
- Delegation to bakers
- Address Book

This is a monorepo which contains all the packages related to Umami.

## Initial setup

- Node.js version is 20.x, you can use [NVM](https://github.com/nvm-sh/nvm) to install it and select for this project.
- Yarn 4.x should be used, you can find the installation guide [here](https://yarnpkg.com/getting-started/install).
- `yarn install` to install all the dependencies
- `npm install turbo --global` to be able to use the [turborepo](https://turbo.build/repo/docs) tooling
- `yarn playwright install --with-deps chromium` to be able to run e2e tests

## Dev workflow

In most cases you'll use turborepo to build all the dependencies and run the app. All tasks are defined in the `turbo.json` file.
Here's a [guide](https://turbo.build/repo/docs/crafting-your-repository/running-tasks) how to run tasks using turbo

## Testing

In order to run all tests in all projects it's enough to run `yarn test` or `turbo test` in the root directory. But, inside the packages
you should use `turbo test`. It will bundle all the dependencies and only then will run the tests whilst `yarn test` will only attempt to run the tests.

Coverage info will be provided in several formats, including HTML at `<package_name>/coverage/lcov-report`.
