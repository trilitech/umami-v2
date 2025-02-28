import { type ImplicitAccount } from "@umami/core";
import { type EncryptedData, decrypt } from "@umami/crypto";
import { type AccountsState, clearSessionKey, useAsyncActionHandler } from "@umami/state";
import { type RawPkh } from "@umami/tezos";
import { type FieldValues } from "react-hook-form";

import { setupPersistence } from "../../utils/store";

export const useLoginWithMnemonic = (
  accounts: AccountsState | null,
  defaultAccount: ImplicitAccount | null
) => {
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const login = (data: FieldValues) =>
    handleAsyncAction(
      async () => {
        if (!defaultAccount || !accounts) {
          clearSessionKey();
          return;
        }

        if (defaultAccount.type === "mnemonic") {
          const mnemonic = (
            JSON.parse(accounts.seedPhrases as unknown as string) as Record<string, EncryptedData>
          )[defaultAccount.seedFingerPrint];
          const result = await decrypt(mnemonic, data.password);
          setupPersistence(result);
        } else if (defaultAccount.type === "secret_key") {
          const secretKey = (
            JSON.parse(accounts.secretKeys as unknown as string) as Record<RawPkh, EncryptedData>
          )[defaultAccount.address.pkh];
          const result = await decrypt(secretKey, data.password);
          setupPersistence(result);
        }
      },
      { title: "Mnemonic or secret key not found" }
    );

  return { isLoading, login };
};
