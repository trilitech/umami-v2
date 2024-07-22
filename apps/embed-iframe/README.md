# Umami Embed iFrame

This repository contains the UI for the Umami Embed component, provided to the component through an iFrame.

Umami-Embed is a component designed to integrate an instance of Umami Wallet into a webpage (or web app) via an iFrame. It securely encapsulates user details and offers an API for the host application to interact with the Tezos blockchain.

Unlike beacon functionality, Umami-Embed allows users to engage with decentralized applications (dApps) directly, eliminating the requirement for a separate wallet application.

The UI can only be accessed through the [Umami Embed Component](https://github.com/trilitech/umami-embed). For more information and integration instructions, please visit the component repository or [npm: @trilitech-umami/umami-embed](https://www.npmjs.com/package/@trilitech-umami/umami-embed).

## Supported Features

The Umami Embed component allows users to create or connect to their Tezos Wallet accounts via social authentication.

Once the user is logged in:

- Various operations can be sent through the component for user approval.
- A payload can be sent to the user for signing.

Public user data is stored in local storage to prevent the need for unnecessary re-logins. Logging out removes the stored data.

For any operation, users can choose to approve or decline the request, which gives them direct control over their transactional decisions and actions.

## Available Scripts

In the project directory, you can run:

### `yarn build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn dev`

Runs the app in development mode at [http://localhost:5173/](http://localhost:5173/).

The page will automatically reload if you make edits. You will also see any lint errors displayed in the console.

### `yarn preview`

This command allows you to locally preview the production build.

### `yarn format` & `yarn lint`

These commands apply formatting rules to the codebase.
