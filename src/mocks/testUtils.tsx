import * as testingLibrary from "@testing-library/react";
import { HashRouter } from "react-router-dom";

import { DynamicModalContext, useDynamicModal } from "../components/DynamicModal";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { ReduxStore } from "../providers/ReduxStore";
import { UmamiTheme } from "../providers/UmamiTheme";

const AllTheProviders = (props: any) => {
  const dynamicModal = useDynamicModal();
  return (
    <HashRouter>
      <ReactQueryProvider>
        <UmamiTheme>
          <ReduxStore>
            <DynamicModalContext.Provider value={dynamicModal}>
              {props.children}
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
// override render method
export { customRender as render, customRenderHook as renderHook };
export const { act, fireEvent, screen, waitFor, within } = testingLibrary;
export * from "@testing-library/user-event";
