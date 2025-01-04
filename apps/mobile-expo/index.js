import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import * as Crypto from "expo-crypto";
import { Buffer } from 'buffer';
import process from 'process';

global.Buffer = Buffer;
global.process = process;

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
