import * as testLib from "@testing-library/react";
import { DynamicModalContext, useDynamicModal } from "@umami/components";
import { type UmamiStore, makeStore } from "@umami/state";
import { type PropsWithChildren, type ReactNode, act } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { UmamiTheme } from "../providers/UmamiTheme";

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

    const openWith = dynamicModal.openWith;
    const onClose = dynamicModal.onClose;
    jest.spyOn(dynamicModal, "openWith").mockImplementation(async (...args) => {
      dynamicDisclosureContextMock.openWith(...args);
      return openWith(...args);
    });
    jest.spyOn(dynamicModal, "onClose").mockImplementation((...args) => {
      dynamicDisclosureContextMock.onClose(...args);
      return onClose(...args);
    });

    return (
      <HashRouter>
        <ReactQueryProvider>
          <UmamiTheme>
            <Provider store={store}>
              <DynamicModalContext.Provider value={dynamicModal}>
                {children}
                {dynamicModal.content}
              </DynamicModalContext.Provider>
            </Provider>
          </UmamiTheme>
        </ReactQueryProvider>
      </HashRouter>
    );
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
): testLib.RenderHookResult<Result, Props> & { store?: UmamiStore } => {
  const store = options?.store ?? makeStore();

  return {
    store,
    ...testLib.renderHook(render, { wrapper: makeWrapper(store), ...options }),
  };
};

// re-export everything
// override render methods
export { customRender as render, customRenderHook as renderHook, act };
export const { fireEvent, screen, waitFor, within } = testLib;
export * from "@testing-library/user-event";
