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
  useMultiForm,
} from "@umami/components";
import { type UmamiStore, makeStore } from "@umami/state";
import { type PropsWithChildren, type ReactElement, type ReactNode, act } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// can be used to spyOn the openWith and onClose methods
export const dynamicModalContextMock = {
  onClose: jest.fn(),
  openWith: jest.fn(),
  goBack: jest.fn(),
};

export const dynamicDrawerContextMock = {
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
      dynamicModalContextMock.openWith(...args);
      return modalOpenWith(...args);
    });
    jest.spyOn(dynamicModal, "onClose").mockImplementation((...args) => {
      dynamicModalContextMock.onClose(...args);
      return modalOnClose(...args);
    });
    jest.spyOn(dynamicModal, "goBack").mockImplementation(() => {
      dynamicModalContextMock.goBack();
      return modalGoBack();
    });

    const drawerOpenWith = dynamicDrawer.openWith;
    const drawerOnClose = dynamicDrawer.onClose;
    const drawerGoBack = dynamicDrawer.goBack;
    jest.spyOn(dynamicDrawer, "openWith").mockImplementation(async (...args) => {
      dynamicDrawerContextMock.openWith(...args);
      return drawerOpenWith(...args);
    });
    jest.spyOn(dynamicDrawer, "onClose").mockImplementation((...args) => {
      dynamicDrawerContextMock.onClose(...args);
      return drawerOnClose(...args);
    });
    jest.spyOn(dynamicDrawer, "goBack").mockImplementation(() => {
      dynamicDrawerContextMock.goBack();
      return drawerGoBack();
    });

    return (
      <BrowserRouter>
        <QueryClientProvider client={new QueryClient()}>
          <Provider store={store}>
            <DynamicModalContext.Provider value={dynamicModal}>
              <DynamicDrawerContext.Provider value={dynamicDrawer}>
                {children}
                {dynamicModal.content}
                {dynamicDrawer.content}
              </DynamicDrawerContext.Provider>
            </DynamicModalContext.Provider>
          </Provider>
        </QueryClientProvider>
      </BrowserRouter>
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

const DummyForm = ({
  defaultValues,
  nextPage,
}: {
  defaultValues: Record<string, any>;
  nextPage: ReactElement;
}) => {
  const { openWith } = useDynamicModalContext();
  const form = useMultiForm({ mode: "onBlur", defaultValues });

  const onSubmit = () => openWith(nextPage);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <button type="submit" />
    </form>
  );
};

export const renderInModal = async (
  component: ReactElement,
  store?: UmamiStore,
  allFormValues?: Record<string, any>
) => {
  const { result, store: _store } = customRenderHook(useDynamicModalContext, { store });

  if (allFormValues) {
    await act(() =>
      result.current.openWith(<DummyForm defaultValues={allFormValues} nextPage={component} />)
    );
    fireEvent.click(screen.getByRole("button"));
  }

  await act(() => result.current.openWith(component));

  return {
    store: _store,
    result,
  };
};

export { act, customRenderHook as renderHook, customRender as render, UserEvent };
export const { fireEvent, screen, waitFor, within } = testLib;
export { userEvent } from "@testing-library/user-event";
