import { render } from "@testing-library/react";
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

const customRender = (ui: any, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";
// override render method
export { customRender as render };
