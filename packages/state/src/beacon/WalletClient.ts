import { WalletClient as WalletClientClass } from "@airgap/beacon-wallet";
import { type Persistor } from "redux-persist";

export const WalletClient =
  typeof window === "undefined" || typeof window.localStorage === "undefined" // cucumber or react-native, stub it
    ? ({} as any as WalletClientClass)
    : new WalletClientClass({
        // production
        name: "Umami",
        iconUrl: "",
        appUrl: "https://umamiwallet.com/",
      });

export const logout = (persistor: Persistor) =>
  WalletClient.destroy()
    .catch(() => {})
    .finally(() => {
      persistor.pause();
      localStorage.clear(); // TODO: fix for react-native
      window.location.replace("/"); // TODO: fix for react-native
    });
