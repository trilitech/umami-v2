import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as testLib from "@testing-library/react";
import { type UmamiStore, makeStore } from "@umami/state";
import { type PropsWithChildren, act } from "react";
import { Provider } from "react-redux";

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
