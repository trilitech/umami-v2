import * as testLib from "@testing-library/react";
import { act, PropsWithChildren, ReactNode } from "react";
import { makeStore, UmamiStore } from "@umami/state";
import { Provider } from "react-redux";
import { DynamicModalContext, useDynamicModal } from "./DynamicDisclosure";
export * from "@testing-library/user-event";

const makeWrapper =
  (store: UmamiStore) =>
  ({ children }: PropsWithChildren) => {
    const modalDisclosure = useDynamicModal();

    return (
      <DynamicModalContext.Provider value={modalDisclosure}>
        <Provider store={store}>{children}</Provider>
        {modalDisclosure.content}
      </DynamicModalContext.Provider>
    );
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

  return {
    store,
    ...testLib.renderHook(render, { wrapper: makeWrapper(store), ...options }),
  };
};

const customRender = <
  Q extends testLib.Queries = typeof testLib.queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  ui: ReactNode,
  options?: testLib.RenderOptions<Q, Container, BaseElement> & { store?: UmamiStore }
): testLib.RenderResult<Q, Container, BaseElement> & { store: UmamiStore } => {
  const store = options?.store ?? makeStore();

  return {
    store,
    ...testLib.render(ui, { wrapper: makeWrapper(store), ...options }),
  };
};

export { act, customRenderHook as renderHook, customRender as render };
export const { fireEvent, screen, waitFor, within } = testLib;
