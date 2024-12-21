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
      const migrationCompleted = localStorage.getItem("migration_2_3_3_to_2_3_4_completed");

      localStorage.clear(); // TODO: fix for react-native

      if (migrationCompleted) {
        localStorage.setItem("migration_2_3_3_to_2_3_4_completed", "true");
      }

      window.location.replace("/"); // TODO: fix for react-native
    });
