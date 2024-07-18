import { Modal } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as testLib from "@testing-library/react";
import { type UserEvent } from "@testing-library/user-event";
import { DynamicModalContext, useDynamicModal } from "@umami/components";
import { type UmamiStore, makeStore } from "@umami/state";
import { type PropsWithChildren, type ReactNode, act } from "react";
import { Provider } from "react-redux";

// can be used to spyOn the openWith and onClose methods
export const dynamicModalContextMock = {
  onClose: jest.fn(),
  openWith: jest.fn(),
};

const makeWrapper =
  (store: UmamiStore) =>
  ({ children }: PropsWithChildren) => {
    const dynamicModal = useDynamicModal();

    const openWith = dynamicModal.openWith;
    const onClose = dynamicModal.onClose;
    jest.spyOn(dynamicModal, "openWith").mockImplementation(async (...args) => {
      dynamicModalContextMock.openWith(...args);
      return openWith(...args);
    });
    jest.spyOn(dynamicModal, "onClose").mockImplementation((...args) => {
      dynamicModalContextMock.onClose(...args);
      return onClose(...args);
    });

    return (
      <QueryClientProvider client={new QueryClient()}>
        <Provider store={store}>
          <DynamicModalContext.Provider value={dynamicModal}>
            {/* Crutch for desktop views to be testable */}
            {/* TODO: remove it when those views are rebuilt for the web */}
            <Modal isOpen={true} onClose={jest.fn()}>
              {children}
              {dynamicModal.content}
            </Modal>
          </DynamicModalContext.Provider>
        </Provider>
      </QueryClientProvider>
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

export { act, customRenderHook as renderHook, customRender as render, UserEvent };
export const { fireEvent, screen, waitFor, within } = testLib;
export { userEvent } from "@testing-library/user-event";
