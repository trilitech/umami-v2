import * as testingLibrary from "@testing-library/react";
import { PropsWithChildren } from "react";
import { HashRouter } from "react-router-dom";

import { DynamicModalContext, useDynamicModal } from "../components/DynamicModal";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { ReduxStore } from "../providers/ReduxStore";
import { UmamiTheme } from "../providers/UmamiTheme";

// can be used to spyOn the openWith and onClose methods
export const dynamicModalContextMock = {
  onClose: jest.fn(),
  openWith: jest.fn(),
};

const AllTheProviders = ({ children }: PropsWithChildren<object>) => {
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
    <HashRouter>
      <ReactQueryProvider>
        <UmamiTheme>
          <ReduxStore>
            <DynamicModalContext.Provider value={dynamicModal}>
              {children}
              {dynamicModal.content}
            </DynamicModalContext.Provider>
          </ReduxStore>
        </UmamiTheme>
      </ReactQueryProvider>
    </HashRouter>
  );
};

const customRender = (...args: Parameters<typeof testingLibrary.render>) =>
  testingLibrary.render(args[0], { wrapper: AllTheProviders, ...args[1] });

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
  testingLibrary.renderHook(render, { wrapper: AllTheProviders, ...options });

// re-export everything
// override render methods
export { customRender as render, customRenderHook as renderHook };
export const { act, fireEvent, screen, waitFor, within } = testingLibrary;
export * from "@testing-library/user-event";
