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

      // need to restore migration flag if it was set before to not run migration again
      const migrationCompleted = localStorage.getItem("migration_to_2_3_5_completed");

      localStorage.clear(); // TODO: fix for react-native
      sessionStorage.clear();
      if (migrationCompleted) {
        localStorage.setItem("migration_to_2_3_5_completed", "true");
      }

      window.location.replace("/"); // TODO: fix for react-native
    });
