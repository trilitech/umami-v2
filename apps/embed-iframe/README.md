# Umami Embed Web

UI for embeddable instance of Umami Wallet.

Umami Embed enables the integration of the Umami Wallet instance directly into a webpage or web app.
It allows users to engage with decentralized applications (dApps) directly, eliminating the requirement for a separate wallet application.

The UI can only be accessed through [Umami Embed Component](https://github.com/trilitech/umami-embed).\
For more information and integration instructions, please visit the component repository.

## Supported Features

### Social login

Allows users to either create or connect to their Tezos Wallet account via social authentication.

### Reviewing and approving/ declining operations initiated from the embed component

Allows users to review incoming operation requests initiated by the parent dApp.\
Users can then choose to approve or decline these requests, giving them direct control over their transactional decisions and actions.

## Available Scripts

In the project directory, you can run:

### `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn dev`

Runs the app in the development mode at [http://localhost:5173/](http://localhost:5173/).
Use [http://localhost:5173/embed](http://localhost:5173/embed) in local run of Umami Embed Component.

The page will automatically reload if you make edits. You will also see any lint errors displayed in the console.

### `yarn preview`

This command allows you to locally preview the production build.

### `yarn format` & `yarn lint`

These commands apply formatting rules to the codebase using Prettier.
