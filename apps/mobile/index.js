import 'node-libs-react-native/globals';
import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
import process from 'process'
import { Buffer } from 'buffer';

Object.assign(global, {
  Buffer,
  process
})

AppRegistry.registerComponent(appName, () => App);
