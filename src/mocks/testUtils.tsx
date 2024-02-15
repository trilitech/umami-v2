import * as testingLibrary from "@testing-library/react";
import { HashRouter } from "react-router-dom";

import { DynamicModalContext, useDynamicModal } from "../components/DynamicModal";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { ReduxStore } from "../providers/ReduxStore";
import { UmamiTheme } from "../providers/UmamiTheme";

export const AllTheProviders = (props: any) => {
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

const customRender = (ui: any, options?: any) =>
  testingLibrary.render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
// override render method
export { customRender as render };
export const { act, renderHook, fireEvent, screen, waitFor, within } = testingLibrary;
export * from "@testing-library/user-event";
