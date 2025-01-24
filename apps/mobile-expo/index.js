import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { Buffer } from 'buffer';

global.Buffer = Buffer;

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
