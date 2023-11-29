import { render, screen } from "@testing-library/react";

import { TruncatedTextWithTooltip } from "./TruncatedTextWithTooltip";

describe("TruncatedTextWithTooltip", () => {
  it("renders just text if the input is short enough", () => {
    render(<TruncatedTextWithTooltip maxLength={10} text="123" />);
    expect(screen.getByTestId("truncated-text")).toHaveTextContent("123");
    expect(screen.getByTestId("truncated-text")).not.toHaveTextContent("...");
  });

  it("renders shortened text and a tooltip if the input large", () => {
    render(<TruncatedTextWithTooltip maxLength={5} text="some text" />);
    expect(screen.getByTestId("truncated-text")).toHaveTextContent("so...");
  });
});
