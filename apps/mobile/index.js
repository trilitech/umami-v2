import "node-libs-react-native/globals";
import { Buffer } from "buffer";
import process from "process"

import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import App from "./src/App";

Object.assign(global, {
  Buffer,
  process
})

AppRegistry.registerComponent(appName, () => App);
