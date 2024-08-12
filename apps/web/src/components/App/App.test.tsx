import { mockImplicitAccount } from "@umami/core";
import { addTestAccount, makeStore } from "@umami/state";

import { App } from "./App";
import { render, screen } from "../../testUtils";

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(map => map["lg"]),
}));

describe("<App />", () => {
  it("renders welcome screen for a new user", () => {
    render(<App />);

    expect(screen.getByTestId("welcome-view")).toBeVisible();
    expect(screen.queryByTestId("signed-in-layout")).not.toBeInTheDocument();
  });

  it("renders signed-in layout for an existing user", () => {
    const store = makeStore();
    addTestAccount(store, mockImplicitAccount(0));

    render(<App />, { store });

    expect(screen.getByTestId("signed-in-layout")).toBeVisible();
    expect(screen.queryByTestId("welcome-view")).not.toBeInTheDocument();
  });
});
