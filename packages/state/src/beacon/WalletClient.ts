import { WalletClient as WalletClientClass } from "@airgap/beacon-wallet";
import { type Persistor } from "redux-persist";

// TODO: check this
export const WalletClient =
  typeof window === "undefined" // cucumber
    ? ({} as any as WalletClientClass)
    : new WalletClientClass({
        // production
        name: "Umami",
        iconUrl: "",
        appUrl: "https://umamiwallet.com/",
      });

export const resetWalletConnection = (persistor: Persistor) =>
  WalletClient.destroy()
    .catch(() => {})
    .finally(() => {
      persistor.pause();
      localStorage.clear();
      window.location.replace("/");
    });
