import * as testingLibrary from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@umami/state";
import { PropsWithChildren, act } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
