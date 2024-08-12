import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as testLib from "@testing-library/react";
import { type UserEvent } from "@testing-library/user-event";
import {
  DynamicDrawerContext,
  DynamicModalContext,
  useDynamicDrawer,
  useDynamicDrawerContext,
  useDynamicModal,
  useDynamicModalContext,
} from "@umami/components";
import { type UmamiStore, makeStore } from "@umami/state";
import { type PropsWithChildren, type ReactElement, type ReactNode, act } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { UmamiTheme } from "./providers/UmamiTheme";

// can be used to spyOn the openWith and onClose methods
export const dynamicDisclosureContextMock = {
  onClose: jest.fn(),
  openWith: jest.fn(),
  goBack: jest.fn(),
};

const makeWrapper =
  (store: UmamiStore) =>
  ({ children }: PropsWithChildren) => {
    const dynamicModal = useDynamicModal();
    const dynamicDrawer = useDynamicDrawer();

    const modalOpenWith = dynamicModal.openWith;
    const modalOnClose = dynamicModal.onClose;
    const modalGoBack = dynamicModal.goBack;
    jest.spyOn(dynamicModal, "openWith").mockImplementation(async (...args) => {
      dynamicDisclosureContextMock.openWith(...args);
      return modalOpenWith(...args);
    });
    jest.spyOn(dynamicModal, "onClose").mockImplementation((...args) => {
      dynamicDisclosureContextMock.onClose(...args);
      return modalOnClose(...args);
    });
    jest.spyOn(dynamicModal, "goBack").mockImplementation(() => {
      dynamicDisclosureContextMock.goBack();
      return modalGoBack();
    });

    const drawerOpenWith = dynamicDrawer.openWith;
    const drawerOnClose = dynamicDrawer.onClose;
    const drawerGoBack = dynamicDrawer.goBack;
    jest.spyOn(dynamicDrawer, "openWith").mockImplementation(async (...args) => {
      dynamicDisclosureContextMock.openWith(...args);
      return drawerOpenWith(...args);
    });
    jest.spyOn(dynamicDrawer, "onClose").mockImplementation((...args) => {
      dynamicDisclosureContextMock.onClose(...args);
      return drawerOnClose(...args);
    });
    jest.spyOn(dynamicDrawer, "goBack").mockImplementation(() => {
      dynamicDisclosureContextMock.goBack();
      return drawerGoBack();
    });

    return (
      <UmamiTheme>
        <BrowserRouter>
          <QueryClientProvider client={new QueryClient()}>
            <Provider store={store}>
              <DynamicModalContext.Provider value={dynamicModal}>
                <DynamicDrawerContext.Provider value={dynamicDrawer}>
                  {/* Crutch for desktop views to be testable */}
                  {/* TODO: remove it when those views are rebuilt for the web */}
                  {children}
                  {dynamicModal.content}
                  {dynamicDrawer.content}
                </DynamicDrawerContext.Provider>
              </DynamicModalContext.Provider>
            </Provider>
          </QueryClientProvider>
        </BrowserRouter>
      </UmamiTheme>
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

export const renderInDrawer = async (component: ReactElement, store?: UmamiStore) => {
  const { result, store: _store } = customRenderHook(useDynamicDrawerContext, { store });

  await act(() => result.current.openWith(component));

  return {
    store: _store,
    result,
  };
};

export const renderInModal = async (component: ReactElement, store?: UmamiStore) => {
  const { result, store: _store } = customRenderHook(useDynamicModalContext, { store });

  await act(() => result.current.openWith(component));

  return {
    store: _store,
    result,
  };
};

export { act, customRenderHook as renderHook, customRender as render, UserEvent };
export const { fireEvent, screen, waitFor, within } = testLib;
export { userEvent } from "@testing-library/user-event";
