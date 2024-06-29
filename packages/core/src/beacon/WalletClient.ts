import { WalletClient as WalletClientClass } from "@airgap/beacon-wallet";

// TODO: check this
export const WalletClient =
  typeof window === "undefined" // cucumber
    ? ({} as any as WalletClientClass)
    : typeof jest !== "undefined" // jest
      ? ({
          getPeers: jest.fn(),
          removePeer: jest.fn(),
        } as any as WalletClientClass)
      : // production
        new WalletClientClass({
          name: "Umami",
          iconUrl: "",
          appUrl: "https://umamiwallet.com/",
        });
