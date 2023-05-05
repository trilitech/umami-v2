import { render } from "@testing-library/react";
import { HashRouter, Router } from "react-router-dom";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { ReduxStore } from "../providers/ReduxStore";
import { UmamiTheme } from "../providers/UmamiTheme";

const AllTheProviders = (props: any) => {
  return (
    <HashRouter>
      <ReactQueryProvider>
        <UmamiTheme>
          <ReduxStore>{props.children}</ReduxStore>
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
