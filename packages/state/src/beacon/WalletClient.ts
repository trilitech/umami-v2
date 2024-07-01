import { WalletClient as WalletClientClass } from "@airgap/beacon-wallet";

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
