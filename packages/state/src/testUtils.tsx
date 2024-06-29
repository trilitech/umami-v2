import { type Account } from "@umami/core";
import { type Multisig } from "@umami/multisig";

import { accountsActions, multisigsActions } from "./slices";
import { store } from "./store";
import * as testingLibrary from "@testing-library/react";

export const addTestAccount = (account: Account | Multisig) => {
  if (!("type" in account) || account.type === "multisig") {
    store.dispatch(multisigsActions.mockAddAccount(account));
    return;
  }

  store.dispatch(accountsActions.addAccount(account));
};

import { PropsWithChildren, act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { RawPkh } from "@umami/tezos";

const queryClient = new QueryClient();

const Wrapper = ({ children }: PropsWithChildren<object>) => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>{children}</Provider>
  </QueryClientProvider>
);

const customRenderHook = <
  Result,
  Props,
  Q extends testingLibrary.Queries = typeof testingLibrary.queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  render: (initialProps: Props) => Result,
  options?: testingLibrary.RenderHookOptions<Props, Q, Container, BaseElement>
): testingLibrary.RenderHookResult<Result, Props> =>
  testingLibrary.renderHook(render, { wrapper: Wrapper, ...options });

export const { waitFor } = testingLibrary;
export { customRenderHook as renderHook, act };

export const fakeIsAccountRevealed = (revealedKeyPairs: { pkh: RawPkh }[]) => (pkh: RawPkh) =>
  Promise.resolve(revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh));
