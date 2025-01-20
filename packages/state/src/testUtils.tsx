import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as testLib from "@testing-library/react";
import { type Account } from "@umami/core";
import { type Multisig } from "@umami/multisig";
import { type RawPkh } from "@umami/tezos";
import { type PropsWithChildren, act } from "react";
import { Provider } from "react-redux";

import { accountsActions, multisigsActions } from "./slices";
import { type UmamiStore, makeStore } from "./store";

export const addTestAccount = (store: UmamiStore, account: Account | Multisig) => {
  if (!("type" in account) || account.type === "multisig") {
    store.dispatch(multisigsActions.mockAddAccount(account));
    return;
  }

  store.dispatch(accountsActions.addAccount(account));
};

export const addTestAccounts = (store: UmamiStore, accounts: (Account | Multisig)[]) => {
  accounts.forEach(account => addTestAccount(store, account));
};

const customRenderHook = <
  Result,
  Props,
  Q extends testLib.Queries = typeof testLib.queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  render: (initialProps: Props) => Result,
  options?: testLib.RenderHookOptions<Props, Q, Container, BaseElement> & {
    store?: UmamiStore;
  }
): testLib.RenderHookResult<Result, Props> & { store: UmamiStore } => {
  const store = options?.store ?? makeStore();

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={new QueryClient()}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  );

  return {
    store,
    ...testLib.renderHook(render, { wrapper: Wrapper, ...options }),
  };
};

export const { waitFor } = testLib;
export { customRenderHook as renderHook, act };

export const fakeIsAccountRevealed = (revealedKeyPairs: { pkh: RawPkh }[]) => (pkh: RawPkh) =>
  Promise.resolve(revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh));

// TODO: clean it
export const mockToast = typeof jest !== "undefined" ? jest.fn() : function () {};
(mockToast as any).close = typeof jest !== "undefined" ? jest.fn() : function () {};
