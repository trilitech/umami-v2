import { type UmamiStore } from "@umami/state";

declare global {
  interface Window {
    store: UmamiStore;
  }
}
