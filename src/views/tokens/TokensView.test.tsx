import { render, screen } from "@testing-library/react";
import { ReduxStore } from "../../providers/ReduxStore";
import TokensView from "./TokensView";

const fixture = () => (
  <ReduxStore>
    <TokensView />
  </ReduxStore>
);

describe("<TokensView />", () => {
  it("a message 'no tokens found' is displayed", () => {
    render(fixture());
    expect(screen.getByText(/no tokens found/i)).toBeInTheDocument();
  });
});
