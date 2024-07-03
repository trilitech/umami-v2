import * as testLib from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, UmamiStore } from "@umami/state";
import { PropsWithChildren, act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
  const queryClient = new QueryClient();
  const store = options?.store ?? makeStore();

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
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
