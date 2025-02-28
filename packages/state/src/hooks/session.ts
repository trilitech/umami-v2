import { type ImplicitAccount, type SocialAccount, withTimeout } from "@umami/core";
import { type EncryptedData, decrypt } from "@umami/crypto";
import { type IDP, forIDP } from "@umami/social-auth";
import { type RawPkh } from "@umami/tezos";

import { useAppSelector } from "./useAppSelector";
import { useAsyncActionHandler } from "./useAsyncActionHandler";
import { type AccountsState } from "../slices/accounts";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes from login
const LOGIN_TIMEOUT = 1000;

export const useHandleSession = () => {
  const isOnboarded = () => !!localStorage.getItem("user_requirements_nonce");
  const isSessionActive = useAppSelector(state => !!state.accounts.current);

  const setupSessionTimeout = () => {
    try {
      const timeoutId = setTimeout(() => {
        sessionStorage.clear();
      }, SESSION_TIMEOUT);

      // Store timeout ID in case we need to clear it
      sessionStorage.setItem("sessionTimeoutId", timeoutId.toString());
    } catch (error) {
      console.error("Failed to setup session timeout:", error);
    }
  };

  return { setupSessionTimeout, isSessionActive, isOnboarded };
};

export const clearSessionKey = () => {
  localStorage.removeItem("user_requirements_nonce");
  window.location.reload();
};

const useLoginWithPassword = (
  defaultAccount: ImplicitAccount | null,
  setupPersistence: (key: string) => void
) => {
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const login = (accounts: AccountsState | null, data: { password: string }) =>
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

const useLoginWithSocial = (setupPersistence: (key: string) => void) => {
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const login = (idp: IDP) =>
    handleAsyncAction(
      async () => {
        const { secretKey } = await withTimeout(() => forIDP(idp).getCredentials(), LOGIN_TIMEOUT);
        setupPersistence(secretKey);
      },
      { title: "Social login failed" }
    );

  return { isLoading, login };
};

type LoginFn<T> = T extends SocialAccount
  ? () => Promise<void>
  : (accounts: AccountsState | null, data: { password: string }) => Promise<void>;

export const useLoginToWallet = (
  defaultAccount: ImplicitAccount | null,
  setupPersistence: (key: string) => void
) => {
  const { isLoading: isLoadingWithPassword, login: loginWithPassword } = useLoginWithPassword(
    defaultAccount,
    setupPersistence
  );
  const { isLoading: isLoadingWithSocial, login: loginWithSocial } =
    useLoginWithSocial(setupPersistence);

  const isSocialAccount = defaultAccount?.type === "social";

  return {
    isLoading: isSocialAccount ? isLoadingWithSocial : isLoadingWithPassword,
    handleLogin: () =>
      isSocialAccount ? () => loginWithSocial(defaultAccount.idp) : loginWithPassword,
  } as {
    isLoading: boolean;
    handleLogin<T extends ImplicitAccount>(): LoginFn<T>;
  };
};
