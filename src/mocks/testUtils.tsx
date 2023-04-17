import { render } from "@testing-library/react";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";
import { ReduxStore } from "../providers/ReduxStore";
import { UmamiTheme } from "../providers/UmamiTheme";

const AllTheProviders = (props: any) => {
  return (
    <ReactQueryProvider>
      <UmamiTheme>
        <ReduxStore>{props.children}</ReduxStore>
      </UmamiTheme>
    </ReactQueryProvider>
  );
};

const customRender = (ui: any, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";
// override render method
export { customRender as render };
