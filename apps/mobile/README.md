This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 0: Install necessary tooling

### Android

You'll need to install [Android Studio](https://developer.android.com/studio)

Also, please install watchman using

```shell
brew install watchman
```

After you install Android studio, start it and install Android SDK. Then add this to your shell profile:

```shell
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

You'll also need a specific java version installed locally. [Jabba](https://github.com/shyiko/jabba?tab=readme-ov-file#macos--linux) may help you. After you install it please run:

```shell
jabba install openjdk@17
jabba alias default openjdk@17
```

### iOS

Please install [Xcode](https://apps.apple.com/us/app/xcode/id497799835).

In order to install [CocoaPods](https://cocoapods.org/) you need to run `bundle` inside the `apps/mobile` directory. It'll install all the necessary gems (ruby packages), as well as CocoaPods itself.

After that, open the `ios` folder and run `pod install`. It'll install all iOS dependencies.

### Misc

It's useful to run `npx react-native doctor` and see what else is missing in your system

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
pnpm start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
pnpm run android
```

### For iOS

```bash
pnpm ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

Sometimes it might help to clean everything up. From the project's root run:

```shell
rm -rf node_modules apps/**/node_modules packages/**/node_modules
pnpm install
cd apps/mobile
p start --reset-cache
```

## iOS

### Missing header files

Try to install the pods once again.

```shell
cd ios
pod install
```

### Archive fails validation

If you see this error:

```
The archive did not include a dSYM for the hermes.framework with the UUIDs [18BF9B62-6D75-343D-8101-DCDCAD648622]. Ensure that the archive's dSYM folder includes a DWARF file for hermes.framework with the expected UUIDs.
```

then download the dSYM files from [here](https://github.com/facebook/react-native/releases/tag/v0.75.4) (Please use the correct version of react-native), and follow [this guide](https://github.com/facebook/react-native/issues/46243#issuecomment-2402818940).

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
