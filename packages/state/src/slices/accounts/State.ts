import { type ImplicitAccount } from "@umami/core";
import { type EncryptedData } from "@umami/crypto";
import { type RawPkh } from "@umami/tezos";

export type AccountsState = {
  items: ImplicitAccount[];
  //TODO: Rename to encryptedMnemonics
  seedPhrases: Record<string, EncryptedData | undefined>;
  secretKeys: Record<RawPkh, EncryptedData | undefined>;
  current?: RawPkh;
  defaultAccount?: ImplicitAccount;
  password?: string;
  alerts: {
    isSocialLoginWarningShown: boolean;
    isExtensionsWarningShown: boolean;
  };
};
