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
      // check if migration from desktop v2.3.3 to v2.3.4 is completed
      // TODO: remove this once all users have upgraded to v2.3.4
      const isMigrationCompleted = localStorage.getItem("migration_2_3_3_to_2_3_4_completed");

      persistor.pause();
      localStorage.clear(); // TODO: fix for react-native

      if (isMigrationCompleted) {
        localStorage.setItem("migration_2_3_3_to_2_3_4_completed", "true");
      }

      window.location.replace("/"); // TODO: fix for react-native
    });
